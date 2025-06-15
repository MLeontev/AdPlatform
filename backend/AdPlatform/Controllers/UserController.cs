using System.Security.Claims;
using AdPlatform.Authorization;
using AdPlatform.DTOs.Users;
using AdPlatform.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AdPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly JwtOptions _jwtOptions;

    public UserController(IUserService userService, IOptions<JwtOptions> jwtOptions)
    {
        _userService = userService;
        _jwtOptions = jwtOptions.Value;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
    {
        try
        {
            var result = await _userService.RegisterUser(registerDto);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                Expires = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryInDays),
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("RefreshToken", result.RefreshToken, cookieOptions);

            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
    {
        try
        {
            var result = await _userService.LoginUser(loginDto);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                Expires = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryInDays),
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("RefreshToken", result.RefreshToken, cookieOptions);

            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("No refresh token provided");

            var result = await _userService.RefreshToken(refreshToken);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                Expires = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryInDays),
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("RefreshToken", result.RefreshToken, cookieOptions);

            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("No refresh token provided");

            await _userService.Logout(refreshToken);

            Response.Cookies.Delete("RefreshToken");

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        try
        {
            var user = await _userService.GetUserById(id);
            if (user == null) return NotFound();

            return Ok(user);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            if (id != userId)
                return Forbid("You cannot update another user");

            var user = await _userService.UpdateUser(id, dto);
            if (user == null) return NotFound();

            return Ok(user);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}