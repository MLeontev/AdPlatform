using System.Security.Claims;
using AdPlatform.DTOs.Ads;
using AdPlatform.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetAdsByUser(int userId, [FromQuery] GetAdsWithSoldDto getAdsDto)
    {
        try
        {
            var ads = await _adService.GetAdsByUser(userId, getAdsDto);
            return Ok(ads);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateAd([FromForm] CreateAdDto createAdDto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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
            var ad = await _adService.GetAdById(id, User);
            if (ad is null) return NotFound();

            return Ok(ad);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAd(int id, [FromForm] UpdateAdDto updateAdDto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _adService.UpdateAd(userId, id, updateAdDto);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAd(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _adService.DeleteAd(userId, id);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}