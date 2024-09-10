namespace AccountStoreApi.Models
{
    public class FileItem
    {
        public string Name { get; set; } = string.Empty;
        public long Size { get; set; }
        public string Type { get; set; } = string.Empty;
        public string ModifiedDate { get; set; } = string.Empty;
    }
}