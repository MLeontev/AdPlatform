using System.ComponentModel.DataAnnotations;

namespace AdPlatform.Models;

public class City
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}