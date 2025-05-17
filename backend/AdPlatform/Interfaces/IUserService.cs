using AdPlatform.DTOs.Users;
using AdPlatform.Models;

namespace AdPlatform.interfaces;

public interface IUserService
{
    Task<AuthResult> RegisterUser(RegisterUserDto registerDto);

    Task<AuthResult> LoginUser(LoginUserDto loginDto);

    Task<AuthResult> RefreshToken(string refreshToken);

    Task Logout(string refreshToken);

    Task<UserDto?> GetUserById(int id);

    Task<UserDto?> UpdateUser(int id, UpdateUserDto dto);
}