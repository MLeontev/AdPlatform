using AdPlatform.Data;
using AdPlatform.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

using (var scope = app.Services.CreateScope())
{
    var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    _context.Database.Migrate();

    if (!await _context.Cities.AnyAsync())
    {
        var cities = LoadCitiesFromCsv("./Data/City.csv");
        _context.Cities.AddRange(cities);
        await _context.SaveChangesAsync();
    }

    if (!await _context.Categories.AnyAsync())
    {
        var categories = LoadCategoriesFromCsv("./Data/categories.csv");
        _context.Categories.AddRange(categories);
        await _context.SaveChangesAsync();
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

static List<City> LoadCitiesFromCsv(string path)
{
    var cities = new List<City>();

    using (var parser = new TextFieldParser(path))
    {
        parser.TextFieldType = FieldType.Delimited;
        parser.SetDelimiters(",");
        parser.HasFieldsEnclosedInQuotes = true;

        if (!parser.EndOfData)
        {
            parser.ReadLine();
        }

        while (!parser.EndOfData)
        {
            string[] parts = parser.ReadFields();
            cities.Add(new City
            {
                Name = parts[9],
            });
        }
    }

    return cities;
}

static List<Category> LoadCategoriesFromCsv(string path)
{
    var categories = new List<Category>();
    foreach (var line in File.ReadAllLines(path).Skip(1))
    {
        var parts = line.Split(',');
        categories.Add(new Category
        {
            Name = parts[1],
        });
    }
    return categories;
}