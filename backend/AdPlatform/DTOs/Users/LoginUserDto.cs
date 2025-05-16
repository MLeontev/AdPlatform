using System.ComponentModel.DataAnnotations;

namespace AdPlatform.DTOs.Users;

public class LoginUserDto
{
    [Required]
    public string Login { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}