using System.ComponentModel.DataAnnotations;

namespace AdPlatform.DTOs.Users;

public class UpdateUserLinkDto
{
    [Required]
    public string Platform { get; set; } = string.Empty;

    [Required]
    [Url]
    public string Link { get; set; } = string.Empty;
}