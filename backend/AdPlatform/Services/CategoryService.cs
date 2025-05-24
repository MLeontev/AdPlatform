using AdPlatform.Data;
using AdPlatform.Interfaces;
using AdPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace AdPlatform.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetCategories()
    {
        return await _context.Categories.ToListAsync();
    }
}