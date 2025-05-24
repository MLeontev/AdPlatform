using AdPlatform.Models;

namespace AdPlatform.Interfaces;

public interface ICategoryService
{
    Task<List<Category>> GetCategories();
}