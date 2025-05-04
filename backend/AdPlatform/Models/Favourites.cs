using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdPlatform.Models;

public class Favourites
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("UserId")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [ForeignKey("AdId")]
    public int AdId { get; set; }
    public Ad Ad { get; set; } = null!;
}