using AdPlatform.DTOs.Ads;
using AdPlatform.Models;

namespace AdPlatform.Interfaces;

public interface IAdService
{
    Task<int> CreateAd(int userId, CreateAdDto createAdDto);
    Task<AdDto?> GetAdById(int adId);
}