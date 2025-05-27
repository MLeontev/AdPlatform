using AdPlatform.Data;
using AdPlatform.DTOs;
using AdPlatform.DTOs.Ads;
using AdPlatform.DTOs.Users;
using AdPlatform.Interfaces;
using AdPlatform.Models;
using AdPlatform.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AdPlatform.Services;

public class AdService : IAdService
{
    private readonly AppDbContext _dbContext;
    private readonly IStorageService _storageService;
    private readonly MinioOptions _minioOptions;

    public AdService(
        AppDbContext dbContext,
        IStorageService storageService,
        IOptions<MinioOptions> minioOptions)
    {
        _dbContext = dbContext;
        _storageService = storageService;
        _minioOptions = minioOptions.Value;
    }

    public async Task<int> CreateAd(int userId, CreateAdDto createAdDto)
    {
        if (await _dbContext.Cities.FindAsync(createAdDto.CityId) == null)
        {
            throw new Exception("City not found");
        }

        if (await _dbContext.Categories.FindAsync(createAdDto.CategoryId) == null)
        {
            throw new Exception("Category not found");
        }

        var ad = new Ad
        {
            Title = createAdDto.Title,
            Description = createAdDto.Description,
            Price = createAdDto.Price,
            CategoryId = createAdDto.CategoryId,
            CityId = createAdDto.CityId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var file in createAdDto.Files)
        {
            var imageSrc = await _storageService.UploadFileAsync(file, _minioOptions.AdImagesBucketName);
            ad.Images.Add(new AdImage { ImageSrc = imageSrc });
        }

        await _dbContext.Ads.AddAsync(ad);
        await _dbContext.SaveChangesAsync();

        return ad.Id;
    }

    public async Task<AdDto?> GetAdById(int adId)
    {
        var ad = await _dbContext.Ads
            .Include(a => a.Images)
            .Include(a => a.User)
            .Include(a => a.Category)
            .Include(a => a.City)
            .FirstOrDefaultAsync(a => a.Id == adId);

        if (ad == null) return null;

        var images = new List<ImageDto>();

        foreach (var i in ad.Images)
        {
            var url = await _storageService.GetFileUrlAsync(i.ImageSrc, _minioOptions.AdImagesBucketName);

            images.Add(new ImageDto
            {
                FileName = i.ImageSrc,
                Url = url
            });
        }

        var avatarSrc = "";
        if (!string.IsNullOrEmpty(ad.User.AvatarSrc))
        {
            avatarSrc = await _storageService.GetFileUrlAsync(ad.User.AvatarSrc, _minioOptions.AvatarsBucketName);
        }

        var links = await _dbContext.UserLinks
            .Where(l => l.UserId == ad.UserId)
            .Select(l => new UserLinkDto
            {
                Platform = l.Platform,
                Link = l.Link
            })
            .ToListAsync();

        return new AdDto
        {
            Id = ad.Id,
            Title = ad.Title,
            Description = ad.Description,
            Price = ad.Price,
            CreatedAt = ad.CreatedAt,
            UpdatedAt = ad.UpdatedAt,
            Images = images,
            CategoryId = ad.Category.Id,
            CategoryName = ad.Category.Name,
            CityId = ad.City.Id,
            CityName = ad.City.Name,
            IsSold = ad.IsSold,
            User = new UserDto
            {
                Id = ad.User.Id,
                Name = ad.User.Name,
                Surname = ad.User.Surname,
                Email = ad.User.Email!,
                Phone = ad.User.PhoneNumber!,
                AvatarSrc = avatarSrc,
                RegistrationDate = ad.User.RegistrationDate,
                Links = links
            }
        };
    }

    public async Task UpdateAd(int userId, int adId, UpdateAdDto updateAdDto)
    {
        var ad = await _dbContext.Ads
            .Include(a => a.Images)
            .FirstOrDefaultAsync(a => a.Id == adId && a.UserId == userId);

        if (ad == null)
        {
            throw new Exception("Ad not found or you do not have permission to update it");
        }

        if (await _dbContext.Cities.FindAsync(updateAdDto.CityId) == null)
        {
            throw new Exception("City not found");
        }

        if (await _dbContext.Categories.FindAsync(updateAdDto.CategoryId) == null)
        {
            throw new Exception("Category not found");
        }

        ad.Title = updateAdDto.Title;
        ad.Description = updateAdDto.Description;
        ad.Price = updateAdDto.Price;
        ad.CategoryId = updateAdDto.CategoryId;
        ad.CityId = updateAdDto.CityId;
        ad.UpdatedAt = DateTime.UtcNow;
        ad.IsSold = updateAdDto.IsSold;

        foreach (var file in updateAdDto.NewFiles)
        {
            var imageSrc = await _storageService.UploadFileAsync(file, _minioOptions.AdImagesBucketName);
            ad.Images.Add(new AdImage { ImageSrc = imageSrc });
        }

        foreach (var fileName in updateAdDto.RemoveFileNames)
        {
            var image = ad.Images.FirstOrDefault(i => i.ImageSrc == fileName);
            if (image != null)
            {
                await _storageService.DeleteFileAsync(image.ImageSrc, _minioOptions.AdImagesBucketName);
                ad.Images.Remove(image);
            }
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAd(int userId, int adId)
    {
        var ad = await _dbContext.Ads
            .Include(a => a.Images)
            .FirstOrDefaultAsync(a => a.Id == adId && a.UserId == userId);

        if (ad == null)
        {
            throw new Exception("Ad not found or you do not have permission to delete it");
        }

        foreach (var image in ad.Images)
        {
            await _storageService.DeleteFileAsync(image.ImageSrc, _minioOptions.AdImagesBucketName);
        }

        _dbContext.Ads.Remove(ad);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<PagedList<AdListItemDto>> GetAds(GetAdsDto getAdsDto)
    {
        var query = _dbContext.Ads
            .Include(a => a.Category)
            .Include(a => a.City)
            .AsQueryable();

        if (!string.IsNullOrEmpty(getAdsDto.SearchQuery))
            query = query.Where(a => a.Title.ToLower().Contains(getAdsDto.SearchQuery.ToLower()));

        if (getAdsDto.MinPrice.HasValue)
            query = query.Where(a => a.Price >= getAdsDto.MinPrice.Value);

        if (getAdsDto.MaxPrice.HasValue)
            query = query.Where(a => a.Price <= getAdsDto.MaxPrice.Value);

        if (getAdsDto.CategoryId.HasValue)
            query = query.Where(a => a.CategoryId == getAdsDto.CategoryId.Value);

        if (getAdsDto.CityIds != null && getAdsDto.CityIds.Count > 0)
            query = query.Where(a => getAdsDto.CityIds.Contains(a.CityId));

        var totalCount = await query.CountAsync();

        var ads = await query
            .Where(a => !a.IsSold)
            .OrderByDescending(a => a.CreatedAt)
            .Include(a => a.Images)
            .Skip((getAdsDto.PageNumber - 1) * getAdsDto.PageSize)
            .Take(getAdsDto.PageSize)
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

        return new PagedList<AdListItemDto>(adDtos, getAdsDto.PageNumber, getAdsDto.PageSize, totalCount);
    }

    public async Task<PagedList<AdListItemDto>> GetAdsByUser(int userId, GetAdsWithSoldDto getAdsDto)
    {
        var query = _dbContext.Ads
            .Include(a => a.Category)
            .Include(a => a.City)
            .Where(a => a.UserId == userId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(getAdsDto.SearchQuery))
            query = query.Where(a => a.Title.ToLower().Contains(getAdsDto.SearchQuery.ToLower()));

        if (getAdsDto.MinPrice.HasValue)
            query = query.Where(a => a.Price >= getAdsDto.MinPrice.Value);

        if (getAdsDto.MaxPrice.HasValue)
            query = query.Where(a => a.Price <= getAdsDto.MaxPrice.Value);

        if (getAdsDto.CategoryId.HasValue)
            query = query.Where(a => a.CategoryId == getAdsDto.CategoryId.Value);

        if (getAdsDto.CityIds != null && getAdsDto.CityIds.Count > 0)
            query = query.Where(a => getAdsDto.CityIds.Contains(a.CityId));

        if (getAdsDto.IsSold.HasValue)
            query = query.Where(a => a.IsSold == getAdsDto.IsSold);

        var totalCount = await query.CountAsync();

        var ads = await query
            .Where(a => !a.IsSold)
            .OrderByDescending(a => a.CreatedAt)
            .Include(a => a.Images)
            .Skip((getAdsDto.PageNumber - 1) * getAdsDto.PageSize)
            .Take(getAdsDto.PageSize)
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

        return new PagedList<AdListItemDto>(adDtos, getAdsDto.PageNumber, getAdsDto.PageSize, totalCount);
    }
}