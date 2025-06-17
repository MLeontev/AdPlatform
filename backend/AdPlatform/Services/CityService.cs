using AdPlatform.Data;
using AdPlatform.Interfaces;
using AdPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace AdPlatform.Services;

public class CityService : ICityService
{
    private readonly AppDbContext _context;

    public CityService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<City>> GetAllCities()
    {
        return await _context.Cities.ToListAsync();
    }
}