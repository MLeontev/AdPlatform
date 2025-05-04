using System.ComponentModel.DataAnnotations;
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
}

public class UserDto
{
    [EmailAddress]
    public string Email { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    [Phone]
    public string Phone { get; set; }
    public IFormFile Avatar { get; set; }
    public DateTimeOffset DateRegister { get; set; }
}