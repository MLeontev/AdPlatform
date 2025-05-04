using System.ComponentModel.DataAnnotations;

namespace AdPlatform.Models;

public class Ad
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Price { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int CityId { get; set; }
    public City City { get; set; } = null!;

    public bool IsSold { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public List<AdImage> Images { get; set; } = new List<AdImage>();
}