using AdPlatform.Storage;
using Microsoft.Extensions.Options;
using Minio.Exceptions;

namespace AdPlatform.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IStorageService _storageService;
    private readonly MinioOptions _minioOptions;

    public TestController(IStorageService storageService, IOptions<MinioOptions> minioOptions)
    {
        _storageService = storageService;
        _minioOptions = minioOptions.Value;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Test endpoint is working!");
    }
    
    [HttpPost("upload/avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        var objectName = await _storageService.UploadFileAsync(file, _minioOptions.AvatarsBucketName);
        return Ok(new { FileName = objectName });
    }

    [HttpGet("avatar-url/{fileName}")]
    public async Task<IActionResult> GetAvatarUrl(string fileName)
    {
        try
        {
            var url = await _storageService.GetFileUrlAsync(fileName, _minioOptions.AvatarsBucketName);
            return Ok(new { Url = url });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete("avatar/{fileName}")]
    public async Task<IActionResult> DeleteAvatar(string fileName)
    {
        try
        {
            await _storageService.DeleteFileAsync(fileName, _minioOptions.AvatarsBucketName);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}