using AdPlatform.DTOs;

namespace AdPlatform.interfaces;

public interface IUserService
{
    Task<AuthResult> RegisterUser(RegisterUserDto registerDto);

    Task<AuthResult> LoginUser(LoginUserDto loginDto);

    Task<AuthResult> RefreshToken(string refreshToken);

    Task Logout(string refreshToken);
}