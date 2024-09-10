using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Microsoft.AspNetCore.Http;
namespace AccountStoreApi.Models;

public class Account
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("number")] 
    public string Number { get; set; } = null!;

    [BsonElement("company")] 
    public string Company { get; set; } = null!;

    [BsonElement("account")] 
    public string AccountName { get; set; } = null!;
    [BsonElement("price")] 
    public decimal Price { get; set; }
    [BsonElement("date")]
    public string Date { get; set; } = null!;
    [BsonElement("Status")]
      public string Status  { get; set; } = null!;
    [BsonElement("FileName")]
    public string? FileName { get; set; } 

    [BsonElement("filepath")]
    public string? FilePath { get; set; } 
}
