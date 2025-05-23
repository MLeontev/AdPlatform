using AdPlatform.DTOs;
using AdPlatform.DTOs.Ads;

namespace AdPlatform.Interfaces;

public interface IFavouritesService
{
    Task AddToFavourites(int userId, int adId);
    Task RemoveFromFavourites(int userId, int adId);
    Task<PagedList<AdListItemDto>> GetFavouriteAds(int userId, GetAdsWithSoldDto getAdsDto);
}