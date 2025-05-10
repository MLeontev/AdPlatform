using AdPlatform.Models;

namespace AdPlatform.interfaces;

public interface IJwtProvider
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}