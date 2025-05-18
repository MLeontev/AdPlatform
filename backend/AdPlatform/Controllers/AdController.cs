using System.Security.Claims;
using AdPlatform.DTOs.Ads;
using AdPlatform.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdController : ControllerBase
{
    private readonly IAdService _adService;

    public AdController(IAdService adService)
    {
        _adService = adService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAds([FromQuery] GetAdsDto getAdsDto)
    {
        try
        {
            var ads = await _adService.GetAds(getAdsDto);
            return Ok(ads);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // [Authorize] - Раскомментировать, когда будет реализована авторизация
    [HttpPost]
    public async Task<IActionResult> CreateAd([FromForm] CreateAdDto createAdDto)
    {
        try
        {
            // Раскомментировать, когда будет реализована авторизация
            // var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var userId = 2; // Временно, для тестирования
            var adId = await _adService.CreateAd(userId, createAdDto);
            return CreatedAtAction(nameof(GetAdById), new { id = adId }, null);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdById(int id)
    {
        try
        {
            var ad = await _adService.GetAdById(id);
            if (ad is null) return NotFound();

            return Ok(ad);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // [Authorize] - Раскомментировать, когда будет реализована авторизация
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAd(int id, [FromForm] UpdateAdDto updateAdDto)
    {
        try
        {
            // Раскомментировать, когда будет реализована авторизация
            // var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var userId = 2; // Временно, для тестирования
            await _adService.UpdateAd(userId, id, updateAdDto);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // [Authorize] - Раскомментировать, когда будет реализована авторизация
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAd(int id)
    {
        try
        {
            // Раскомментировать, когда будет реализована авторизация
            // var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var userId = 2; // Временно, для тестирования
            await _adService.DeleteAd(userId, id);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}