using System;
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
namespace MongoAuthenticatorAPI.Models
{
     [CollectionName("users")]
    public class ApplicationUser : MongoIdentityUser<Guid>
    {
        public string FullName { get; set; } = String.Empty;
        public List<Guid> Role { get; set; } = new List<Guid>();
        // public List<Guid> Role { get; set; } = string.Empty;
        // public string Role { get; set; } = String.Empty;
        public string CurrentRole { get; set; } = string.Empty;

    }
}