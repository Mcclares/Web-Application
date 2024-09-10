using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace AccountStoreApi.Controllers
{
    [Authorize]// Только авторизованным пользователям разрешен доступ к этому контроллеру
    [Route("api/[controller]")]
    [ApiController]
    public class ProtectedController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProtectedResource()
        {
            // Если запрос дошел до этого момента, значит, пользователь авторизован
            // и у него есть доступ к защищенному ресурсу
            return Ok("Protected resource accessed successfully!");
        }
    }
}