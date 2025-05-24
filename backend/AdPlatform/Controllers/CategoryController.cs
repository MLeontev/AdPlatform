using AdPlatform.Interfaces;
using AdPlatform.Models;
using AdPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace AdPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAll()
    {
        var categories = await _categoryService.GetCategories();
        return Ok(categories);
    }
}