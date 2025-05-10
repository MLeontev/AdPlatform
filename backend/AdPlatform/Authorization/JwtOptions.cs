namespace AdPlatform.Authorization;

public class JwtOptions
{
    public string SecretKey { get; set; } = string.Empty;

    public int AccessTokenExpiryInMinutes { get; set; }

    public int RefreshTokenExpiryInDays { get; set; }
}