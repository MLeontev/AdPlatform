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

    [HttpPost]
    public async Task<IActionResult> CreateAd([FromForm] CreateAdDto createAdDto)
    {
        try
        {
            // Раскомментировать, когда будет реализована авторизация
            // var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var userId = 2; // Временно, для тестирования
            var adId = await _adService.CreateAd(userId, createAdDto);
            return Created();
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
}