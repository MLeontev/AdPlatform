namespace AdPlatform.Storage;

public interface IStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string bucketName);
    Task<string> GetFileUrlAsync(string fileName, string bucketName);
    Task DeleteFileAsync(string fileName, string bucketName);
}