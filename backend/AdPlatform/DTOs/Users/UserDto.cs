namespace AdPlatform.DTOs.Users;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AvatarSrc { get; set; } = string.Empty;
    public DateTimeOffset RegistrationDate { get; set; }
}
