using AdPlatform.Authorization;
using AdPlatform.Data;
using AdPlatform.DTOs.Users;
using AdPlatform.interfaces;
using AdPlatform.Models;
using AdPlatform.Storage;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AdPlatform.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtProvider _jwtProvider;
    private readonly JwtOptions _jwtOptions;
    private readonly MinioOptions _minioOptions;
    private readonly IStorageService _storageService;
    private readonly AppDbContext _dbContext;

    public UserService(
        UserManager<User> userManager,
        IJwtProvider jwtProvider,
        IOptions<JwtOptions> jwtOptions,
        IOptions<MinioOptions> minioOptions,
        IStorageService storageService,
        AppDbContext dbContext)
    {
        _userManager = userManager;
        _jwtProvider = jwtProvider;
        _jwtOptions = jwtOptions.Value;
        _minioOptions = minioOptions.Value;
        _storageService = storageService;
        _dbContext = dbContext;
    }

    public async Task<AuthResult> RegisterUser(RegisterUserDto registerDto)
    {
        var userByEmail = await _userManager.FindByEmailAsync(registerDto.Email);
        if (userByEmail is not null)
            throw new Exception("User with this email already exists");

        var userByPhone = await _userManager.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == registerDto.Phone);
        if (userByPhone is not null)
            throw new Exception("User with this phone number already exists");

        var user = new User
        {
            Email = registerDto.Email,
            PhoneNumber = registerDto.Phone,
            UserName = registerDto.Email,
            Name = registerDto.Name,
            Surname = registerDto.Surname,
            RegistrationDate = DateTimeOffset.UtcNow
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors
                .Select(e => e.Description)
                .ToList();
            throw new Exception(string.Join("; ", errors));
        }

        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshToken = _jwtProvider.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryInDays);

        await _userManager.UpdateAsync(user);

        return new AuthResult
        {
            Id = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        };
    }

    public async Task<AuthResult> LoginUser(LoginUserDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Login);

        if (user is null)
            user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == loginDto.Login);

        if (user is null)
            throw new Exception("Invalid login or password");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isPasswordValid)
            throw new Exception("Invalid login or password");

        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshToken = _jwtProvider.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryInDays);

        await _userManager.UpdateAsync(user);

        return new AuthResult
        {
            Id = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        };
    }

    public async Task<AuthResult> RefreshToken(string refreshToken)
    {
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null
            || user.RefreshToken != refreshToken
            || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new Exception("Invalid refresh token");

        var newAccessToken = _jwtProvider.GenerateAccessToken(user);
        var newRefreshToken = _jwtProvider.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryInDays);

        await _userManager.UpdateAsync(user);

        return new AuthResult
        {
            Id = user.Id,
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
        };
    }

    public async Task Logout(string refreshToken)
    {
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null) throw new Exception("Invalid refresh token");

        user.RefreshToken = string.Empty;
        user.RefreshTokenExpiryTime = null;
        await _userManager.UpdateAsync(user);
    }

    public async Task<UserDto?> GetUserById(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return null;

        var avatarSrc = "";
        if (!string.IsNullOrEmpty(user.AvatarSrc))
        {
            avatarSrc = await _storageService.GetFileUrlAsync(user.AvatarSrc, _minioOptions.AvatarsBucketName);
        }

        var links = await _dbContext.UserLinks
            .Where(l => l.UserId == user.Id)
            .Select(l => new UserLinkDto
            {
                Platform = l.Platform,
                Link = l.Link
            })
            .ToListAsync();

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email!,
            Phone = user.PhoneNumber!,
            AvatarSrc = avatarSrc,
            RegistrationDate = user.RegistrationDate,
            Links = links
        };
    }

    public async Task<UserDto?> UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return null;

        var existingByEmail = await _userManager.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Id != id);
        if (existingByEmail != null)
            throw new Exception("A user with this email already exists");

        var existingByPhone = await _userManager.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == dto.Phone && u.Id != id);
        if (existingByPhone != null)
            throw new Exception("A user with this phone number already exists");

        user.Name = dto.Name;
        user.Surname = dto.Surname;
        user.Email = dto.Email;
        user.PhoneNumber = dto.Phone;

        if (dto.Avatar != null)
        {
            if (!string.IsNullOrWhiteSpace(user.AvatarSrc))
            {
                await _storageService.DeleteFileAsync(user.AvatarSrc, _minioOptions.AvatarsBucketName);
            }

            var fileName = await _storageService.UploadFileAsync(dto.Avatar, _minioOptions.AvatarsBucketName);
            user.AvatarSrc = fileName;
        }

        var oldLinks = _dbContext.UserLinks.Where(l => l.UserId == user.Id);
        _dbContext.UserLinks.RemoveRange(oldLinks);

        foreach (var linkDto in dto.Links)
        {
            _dbContext.UserLinks.Add(new UserLink
            {
                UserId = user.Id,
                Platform = linkDto.Platform,
                Link = linkDto.Link
            });
        }

        await _userManager.UpdateAsync(user);
        await _dbContext.SaveChangesAsync();

        var avatarSrc = "";
        if (!string.IsNullOrEmpty(user.AvatarSrc))
        {
            avatarSrc = await _storageService.GetFileUrlAsync(user.AvatarSrc, _minioOptions.AvatarsBucketName);
        }

        var links = await _dbContext.UserLinks
            .Where(l => l.UserId == user.Id)
            .Select(l => new UserLinkDto
            {
                Platform = l.Platform,
                Link = l.Link
            })
            .ToListAsync();

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email!,
            Phone = user.PhoneNumber!,
            AvatarSrc = avatarSrc,
            RegistrationDate = user.RegistrationDate,
            Links = links
        };
    }
}
