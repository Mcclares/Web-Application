using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace MongoAuthenticatorAPI.Dtos {
    public class LoginRequest {
        [Required,EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required,DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

    }
}