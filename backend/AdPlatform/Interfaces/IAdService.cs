using AdPlatform.DTOs;
using AdPlatform.DTOs.Ads;
using AdPlatform.Models;

namespace AdPlatform.Interfaces;

public interface IAdService
{
    Task<int> CreateAd(int userId, CreateAdDto createAdDto);
    Task<PagedList<AdListItemDto>> GetAds(GetAdsDto getAdsDto);
    Task<PagedList<AdListItemDto>> GetAdsByUser(int userId, GetAdsWithSoldDto getAdsDto);
    Task<AdDto?> GetAdById(int adId);
    Task UpdateAd(int userId, int adId, UpdateAdDto updateAdDto);
    Task DeleteAd(int userId, int adId);
}