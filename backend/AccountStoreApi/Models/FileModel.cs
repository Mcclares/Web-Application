namespace AccountStoreApi.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class FileModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
     [BsonElement("OldName")]
    public string OldName { get; set; } = string.Empty;

    [BsonElement("FileFolder")]
    public string ?FileFolder { get; set; }
    [BsonElement("FileName")]
    public string FileName { get; set; } = string.Empty;
    [BsonElement("FilePath")]
    public string ?FilePath { get; set; }
    public FileModel()
    {
            // Пустой конструктор по умолчанию
    }

    public FileModel(FileModel a)
        {
        OldName = a.OldName;
        FileFolder = a.FileFolder;
        FileName = a.FileName;
        FilePath = a.FilePath;
    }
}