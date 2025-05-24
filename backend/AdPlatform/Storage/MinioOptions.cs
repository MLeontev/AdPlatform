namespace AdPlatform.Storage;

public class MinioOptions
{
    public string AvatarsBucketName { get; set; } = string.Empty;
    public string AdImagesBucketName { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public bool UseSSL { get; set; }
    public string PublicUrlBase { get; set; } = string.Empty;
}