using AdPlatform.Models;

namespace AdPlatform.Interfaces;

public interface ICityService
{
    Task<List<City>> GetAllCities();
}