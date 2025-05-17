namespace AdPlatform.DTOs.Users;

public class AuthResult
{
    public int Id { get; set; }
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}