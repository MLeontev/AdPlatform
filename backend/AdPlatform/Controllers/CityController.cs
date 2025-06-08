using AdPlatform.Data;
using AdPlatform.Interfaces;
using AdPlatform.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CityController : ControllerBase
{
    private readonly ICityService _cityService;

    public CityController(ICityService cityService)
    {
        _cityService = cityService;
    }

    [HttpGet]
    public async Task<ActionResult<List<City>>> GetCategories()
    {
        var cities = await _cityService.GetAllCities();
        return  Ok(cities);
    }
}