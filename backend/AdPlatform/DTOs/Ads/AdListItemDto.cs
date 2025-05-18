namespace AdPlatform.DTOs.Ads;

public class AdListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Price { get; set; }
    public bool IsSold { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CityName { get; set; } = string.Empty;
    public string MainImage { get; set; } = string.Empty;
}