using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace AdPlatform.Storage;

public class MinioStorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly MinioOptions _minioOptions;

    public MinioStorageService(IMinioClient minioClient, IOptions<MinioOptions> minioOptions)
    {
        _minioClient = minioClient;
        _minioOptions = minioOptions.Value;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string bucketName)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        var found = await _minioClient
            .BucketExistsAsync(new BucketExistsArgs()
                .WithBucket(bucketName));

        if (!found)
        {
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));
        }

        var objectName = Guid.NewGuid() + Path.GetExtension(file.FileName);

        await using var stream = file.OpenReadStream();

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectName)
            .WithStreamData(stream)
            .WithObjectSize(file.Length)
            .WithContentType(file.ContentType);

        await _minioClient.PutObjectAsync(putObjectArgs);

        return objectName;
    }

    public async Task<string> GetFileUrlAsync(string fileName, string bucketName)
    {
        var presignedGetObjectArgs = new PresignedGetObjectArgs()
            .WithBucket(bucketName)
            .WithObject(fileName)
            .WithExpiry(60 * 60);

        var url = await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs);

        var internalBaseUrl = $"http://{_minioOptions.Endpoint}";
        url = url.Replace(internalBaseUrl, _minioOptions.PublicUrlBase);

        return url;
    }

    public async Task DeleteFileAsync(string fileName, string bucketName)
    {
        var removeObjectArgs = new RemoveObjectArgs()
            .WithBucket(bucketName)
            .WithObject(fileName);

        await _minioClient.RemoveObjectAsync(removeObjectArgs);
    }
}