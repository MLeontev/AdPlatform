namespace AdPlatform.Models;

public class UserLink
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Platform { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
}

