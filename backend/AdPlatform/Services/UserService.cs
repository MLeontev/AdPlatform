using AdPlatform.Authorization;
using AdPlatform.DTOs;
using AdPlatform.interfaces;
using AdPlatform.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AdPlatform.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtProvider _jwtProvider;
    private readonly JwtOptions _jwtOptions;

    public UserService(
        UserManager<User> userManager,
        IJwtProvider jwtProvider,
        IOptions<JwtOptions> jwtOptions)
    {
        _userManager = userManager;
        _jwtProvider = jwtProvider;
        _jwtOptions = jwtOptions.Value;
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
}
