using AdPlatform.DTOs.Users;

namespace AdPlatform.DTOs.Ads;

public class AdDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Price { get; set; }

    public bool IsSold { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    public string CategoryName { get; set; } = string.Empty;
    public string CityName { get; set; } = string.Empty;

    public UserDto User { get; set; } = null!;

    public List<ImageDto> Images { get; set; } = [];
}

public class ImageDto
{
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}