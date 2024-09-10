using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoAuthenticatorAPI.Dtos;
using MongoAuthenticatorAPI.Models;
using LoginRequest = MongoAuthenticatorAPI.Dtos.LoginRequest;
using RegisterRequest = MongoAuthenticatorAPI.Dtos.RegisterRequest;
using System.Data;
using Microsoft.AspNetCore.Authorization;


//Контроллер аутентификации - отвечает за авторизаци, регистрацию и вход на сайт 

namespace MongoAuthenticatorAPI.Controllers
{
    [ApiController]
    [Route("api/authenticate")]
    public class AuthenticationController(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager, IConfiguration configuration)
        : ControllerBase
    {
        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            var users = await Task.Run(() => userManager.Users.ToList());
            return Ok(users);
        }

        //Удаления пользователя
        [HttpDelete("users/delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(); // Пользователь не найден
            }

            var result = await userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return NoContent(); // Пользователь успешно удален
            }
            else
            {
                // Обработка ошибок при удалении пользователя
                return StatusCode(500, "Failed to delete user.");
            }
        }


        //Добавления новой роли в MongoDB
        [HttpPost]
        [Route("roles/add")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
        {
            var appRole = new ApplicationRole { Name = request.Role };
            var createRole = await roleManager.CreateAsync(appRole);

            return Ok(new { message = "role created succesfully" });
        }


        // Регистрация нового человека
        
        [HttpPost]
        [Authorize] //это менялось
        [Route("register")]
        
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await RegisterAsync(request);

            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

        private async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                var userExists = await userManager.FindByEmailAsync(request.Email);
                if (userExists != null)
                    return new RegisterResponse { Message = "User already exists", Success = false };

                //if we get here, no user with this email..

                // Предположим, что у вас есть свойство RoleId в модели ApplicationUser


                userExists = new ApplicationUser
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    ConcurrencyStamp = Guid.NewGuid().ToString(),
                    UserName = request.Email,
                    CurrentRole = request.Role
                };
                var createUserResult = await userManager.CreateAsync(userExists, request.Password);
                if (!createUserResult.Succeeded)
                    return new RegisterResponse
                    {
                        Message = $"Create user failed {createUserResult?.Errors?.First()?.Description}",
                        Success = false
                    };
                //user is created...
                //then add user to a role...


                //Здесь менялось
                var addUserToRoleResult = await userManager.AddToRoleAsync(userExists, request.Role);
                if (!addUserToRoleResult.Succeeded)
                    return new RegisterResponse
                    {
                        Message =
                            $"Create user succeeded but could not add user to role {addUserToRoleResult?.Errors?.First()?.Description}",
                        Success = false
                    };

                //all is still well..
                return new RegisterResponse
                {
                    Success = true,
                    Message = "User registered successfully"
                };
            }
            catch (Exception ex)
            {
                return new RegisterResponse { Message = ex.Message, Success = false };
            }
        }

        //Проверяет человек авторизован или нет
        [HttpGet("check-auth")]
        [Authorize]
        public IActionResult CheckAuth()
        {
            return Ok(new { message = "Authenticated" });
        }

        //Пост запрос на проверку логина
        [HttpPost]
        [Route("login")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(LoginResponse))]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await LoginAsync(request);
            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result.Message);
        }

        private async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user is null) return new LoginResponse { Message = "Invalid email/password", Success = false };

                var passwordHasher = new PasswordHasher<ApplicationUser>();
                var verificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, request.Password);
                
                if (verificationResult == PasswordVerificationResult.Failed) 
                {
                    return new LoginResponse { Message = "Invalid email/password", Success = false };
                }

                //all is well if ew reach here
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim("currentRole", user.CurrentRole) // Добавляем текущую роль
                };
                var roles = await userManager.GetRolesAsync(user);
                var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x));
                claims.AddRange(roleClaims);

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.Now.AddMinutes(180); //Время жизни токена

                var token = new JwtSecurityToken(
                    issuer: configuration["Jwt:Issuer"],
                    audience: configuration["Jwt:Audience"],
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds
                );
                var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

              

                // //Если есть проблемы с авторизации,смотри эти штуки
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, //https for after you need to change
                    SameSite = SameSiteMode.Strict,
                    Expires = expires
                };
                Response.Cookies.Append("jwt", accessToken, cookieOptions);

                return new LoginResponse
                {
                    AccessToken = accessToken,
                    Message = "Login Successful",
                    Email = user?.Email!,
                    Success = true,
                    UserId = user?.Id.ToString()!,
                    FullName = user?.FullName!,
                    Role = user?.CurrentRole!
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new LoginResponse { Success = false, Message = ex.Message };
            }
        }
    }
}