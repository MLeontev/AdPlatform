using System.ComponentModel.DataAnnotations;

namespace AdPlatform.Models;

public class AdImage
{
    [Key]
    public int Id { get; set; }
    public string ImageSrc { get; set; } = string.Empty;
    public int AdId { get; set; }
    public Ad Ad { get; set; } = null!;
}