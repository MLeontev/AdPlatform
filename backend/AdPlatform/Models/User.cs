using Microsoft.AspNetCore.Identity;

namespace AdPlatform.Models;

public class User : IdentityUser<int>
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string AvatarSrc { get; set; } = string.Empty;
    public DateTimeOffset RegistrationDate { get; set; }

    public string RefreshToken { get; set; } = string.Empty;
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public List<Ad> Ads { get; set; } = [];
    public List<Favourites> Favourites { get; set; } = [];

    public List<UserLink> Links { get; set; } = [];
}
