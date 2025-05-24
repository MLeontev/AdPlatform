using System.Text;
using AdPlatform.Authorization;
using AdPlatform.Data;
using AdPlatform.interfaces;
using AdPlatform.Interfaces;
using AdPlatform.Models;
using AdPlatform.Services;
using AdPlatform.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic.FileIO;
using Minio;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
        options.Password.RequiredUniqueChars = 0;
    })
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.Configure<MinioOptions>(builder.Configuration.GetSection(nameof(MinioOptions)));
builder.Services.AddSingleton(sp =>
{
    var options = sp.GetRequiredService<IOptions<MinioOptions>>().Value;
    return new MinioClient()
        .WithEndpoint(options.Endpoint)
        .WithCredentials(options.AccessKey, options.SecretKey)
        .WithSSL(options.UseSSL)
        .Build();
});

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));
var jwtOptions = builder.Configuration.GetSection(nameof(JwtOptions))
    .Get<JwtOptions>();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions!.SecretKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdService, AdService>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IStorageService, MinioStorageService>();

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
});

using (var scope = app.Services.CreateScope())
{
    var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    _context.Database.Migrate();

    if (!await _context.Cities.AnyAsync())
    {
        var cities = LoadCitiesFromCsv("./Data/city.csv");
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

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();

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