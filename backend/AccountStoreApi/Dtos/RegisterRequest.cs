using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace MongoAuthenticatorAPI.Dtos {
    public class RegisterRequest {
        [Required,EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public string Username { get; set; } = string.Empty;
        [Required]
        public string FullName{ get; set; } = string.Empty;

        [Required,DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
        [Required,DataType(DataType.Password), Compare(nameof(Password),ErrorMessage ="Password do not match")]
        public string ConfirmPassword{ get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        
       

    }
}