using AdPlatform.Data;
using AdPlatform.DTOs;
using AdPlatform.DTOs.Ads;
using AdPlatform.Interfaces;
using AdPlatform.Models;
using AdPlatform.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AdPlatform.Services;

public class FavouritesService : IFavouritesService
{
    private readonly AppDbContext _dbContext;
    private readonly IStorageService _storageService;
    private readonly MinioOptions _minioOptions;

    public FavouritesService(
        AppDbContext dbContext,
        IStorageService storageService,
        IOptions<MinioOptions> minioOptions)
    {
        _dbContext = dbContext;
        _storageService = storageService;
        _minioOptions = minioOptions.Value;
    }

    public async Task AddToFavourites(int userId, int adId)
    {
        var exists = await _dbContext.Favourites.AnyAsync(f => f.UserId == userId && f.AdId == adId);

        if (exists)
        {
            throw new Exception("Ad is already in favourites");
        }

        _dbContext.Favourites.Add(new Favourites { UserId = userId, AdId = adId });
        await _dbContext.SaveChangesAsync();
    }

    public async Task RemoveFromFavourites(int userId, int adId)
    {
        var fav = await _dbContext.Favourites.FirstOrDefaultAsync(f => f.UserId == userId && f.AdId == adId)
            ?? throw new Exception("Ad is not in favourites");

        _dbContext.Favourites.Remove(fav);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<PagedList<AdListItemDto>> GetFavouriteAds(int userId, GetAdsWithSoldDto filterDto)
    {
        var favAdIds = await _dbContext.Favourites
            .Where(f => f.UserId == userId)
            .Select(f => f.AdId)
            .ToListAsync();

        var query = _dbContext.Ads
            .Include(a => a.Category)
            .Include(a => a.City)
            .Include(a => a.Images)
            .Where(a => favAdIds.Contains(a.Id))
            .AsQueryable();

        if (!string.IsNullOrEmpty(filterDto.SearchQuery))
            query = query.Where(a => a.Title.ToLower().Contains(filterDto.SearchQuery.ToLower()));

        if (filterDto.MinPrice.HasValue)
            query = query.Where(a => a.Price >= filterDto.MinPrice.Value);

        if (filterDto.MaxPrice.HasValue)
            query = query.Where(a => a.Price <= filterDto.MaxPrice.Value);

        if (filterDto.CategoryId.HasValue)
            query = query.Where(a => a.CategoryId == filterDto.CategoryId.Value);

        if (filterDto.CityIds != null && filterDto.CityIds.Count > 0)
            query = query.Where(a => filterDto.CityIds.Contains(a.CityId));

        if (filterDto.IsSold.HasValue)
            query = query.Where(a => a.IsSold == filterDto.IsSold);

        var totalCount = await query.CountAsync();

        var ads = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((filterDto.PageNumber - 1) * filterDto.PageSize)
            .Take(filterDto.PageSize)
            .ToListAsync();

        var adDtos = new List<AdListItemDto>();
        foreach (var ad in ads)
        {
            var mainImage = ad.Images.FirstOrDefault()?.ImageSrc ?? string.Empty;
            var url = string.IsNullOrEmpty(mainImage)
                ? string.Empty
                : await _storageService.GetFileUrlAsync(mainImage, _minioOptions.AdImagesBucketName);

            adDtos.Add(new AdListItemDto
            {
                Id = ad.Id,
                Title = ad.Title,
                Price = ad.Price,
                IsSold = ad.IsSold,
                CategoryName = ad.Category.Name,
                CityName = ad.City.Name,
                MainImage = url
            });
        }

        return new PagedList<AdListItemDto>(adDtos, filterDto.PageNumber, filterDto.PageSize, totalCount);
    }
}