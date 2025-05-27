using System.ComponentModel.DataAnnotations;

namespace AdPlatform.DTOs.Ads;

public class UpdateAdDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, 999999999)]
    public int Price { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int CityId { get; set; }

    [Required]
    public bool IsSold { get; set; }

    public List<IFormFile> NewFiles { get; set; } = [];

    public List<string> RemoveFileNames { get; set; } = [];
}