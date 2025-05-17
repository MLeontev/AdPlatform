using System.ComponentModel.DataAnnotations;

namespace AdPlatform.DTOs.Ads;

public class CreateAdDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(1, 999999999)]
    public int Price { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int CityId { get; set; }

    public List<IFormFile> Files { get; set; } = [];
}