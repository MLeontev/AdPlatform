using AdPlatform.DTOs.Ads;
using AdPlatform.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AdPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavouritesController : ControllerBase
{
    private readonly IFavouritesService _favouritesService;

    public FavouritesController(IFavouritesService favouritesService)
    {
        _favouritesService = favouritesService;
    }

    [Authorize]
    [HttpPost("{adId}")]
    public async Task<IActionResult> AddToFavourites(int adId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _favouritesService.AddToFavourites(userId, adId);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpDelete("{adId}")]
    public async Task<IActionResult> RemoveFromFavourites(int adId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _favouritesService.RemoveFromFavourites(userId, adId);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpGet("ads")]
    public async Task<IActionResult> GetFavouriteAds([FromQuery] GetAdsWithSoldDto filterDto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _favouritesService.GetFavouriteAds(userId, filterDto);
            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}