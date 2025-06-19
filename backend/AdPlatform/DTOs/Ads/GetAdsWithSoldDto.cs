using System.ComponentModel.DataAnnotations;

namespace AdPlatform.DTOs.Ads;

public class GetAdsWithSoldDto
{
    public int? CategoryId { get; set; }
    public List<int>? CityIds { get; set; }
    public string? SearchQuery { get; set; }

    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }

    [Range(1, int.MaxValue)]
    public int PageNumber { get; set; } = 1;
    [Range(1, int.MaxValue)]
    public int PageSize { get; set; } = 10;

    public bool? IsSold { get; set; }
}