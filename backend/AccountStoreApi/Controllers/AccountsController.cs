using AccountStoreApi.Models;
using AccountStoreApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


//Это контроллер отвечает за создание счетов, и хранения их в базе данных,
//Также внизу реализация загрузки файлов.

namespace AccountStoreApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly AccountsService _accountsService;
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly ILogger<AccountsController> _logger; //связано с удалением файла


    public AccountsController(AccountsService accountsService, IWebHostEnvironment webHostEnvironment,
        ILogger<AccountsController> logger)
    {
        _accountsService = accountsService;
        _webHostEnvironment = webHostEnvironment;
        _logger = logger;
    }

    //Получение списка счетов, хранящихся в базе данных MongoDB.
    [Authorize]
    [HttpGet]
    public async Task<List<Account>> Get() =>
        await _accountsService.GetAsync();

    //Получение конкретного счета
    [Authorize]
    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Account>> Get(string id)
    {
        var account = await _accountsService.GetAsync(id);


        if (account is null)
        {
            return NotFound();
        }

        return account;
    }

    //Создание нового счета
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post(Account newAccount)
    {
        await _accountsService.CreateAsync(newAccount); // вся реализация находиться в AccountsService.cs
        //Там также подключение к базе данных

        return CreatedAtAction(nameof(Get), new { id = newAccount.Id }, newAccount);
    }

    //Для обновления счета 
    [Authorize]
    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Account updatedAccount)
    {
        var account = await _accountsService.GetAsync(id);

        if (account is null)
        {
            return NotFound();
        }

        updatedAccount.Id = account.Id;

        await _accountsService.UpdateAsync(id, updatedAccount);

        return NoContent();
    }

    //Удаления счета
    [Authorize]
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var account = await _accountsService.GetAsync(id);

        if (account is null)
        {
            return NotFound();
        }

        if (account.FileName != null)
        {
            // Удаление файлаC:\Users\Arvuti\Desktop\OBD2.0\frontend-service\backend\AccountStoreApi\uploads\49588a0c-78d6-4c83-8000-cabfec87d790_Resume.pdf
            try
            {
                string filePath = Path.Combine(_webHostEnvironment.ContentRootPath, account.FilePath!);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                // Обработка ошибок удаления файла
                _logger.LogError(ex, "Ошибка при удалении файла");
                return StatusCode(StatusCodes.Status500InternalServerError, "Произошла ошибка при удалении файла");
            }
        }

        await _accountsService.RemoveAsync(id);

        return NoContent();
    }

    //Это получения файла
    [HttpGet("{fileName}")]
    public IActionResult GetFile(string fileName)
    {
        // var accessToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", ""); при защиие открытия файла надо будет прикрутить
        try
        {
            string filePath = Path.Combine(_webHostEnvironment.ContentRootPath, "AccountsFiles", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    //а это загрузка файла на сервер
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile([FromForm] Account model, IFormFile? file = null)
    {
        try
        {
            if (file != null && file.Length > 0)

            {
                var allowedExtensions = new[]
                    { ".jpg", ".jpeg", ".png", ".pdf" }; // Добавьте другие разрешенные форматы сюда

                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Allowed file types are JPEG, PNG, and PDF.");
                }

                string uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "AccountsFiles");


                string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;

                string filePathInDb = "AccountsFiles\\" + uniqueFileName;
                string filePathOnDisk = Path.Combine(uploadsFolder, uniqueFileName);
                using (var stream = new FileStream(filePathOnDisk, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Создание нового аккаунта и сохранение пути к файлу в MongoDB
                var newAccount = new Account
                {
                    Number = model.Number,
                    Company = model.Company,
                    AccountName = model.AccountName,
                    Price = model.Price,
                    Date = model.Date,
                    Status = model.Status,
                    FileName = uniqueFileName,
                    FilePath = filePathInDb,
                };

                await _accountsService.CreateAsync(newAccount);

                return Ok("File uploaded successfully and new account created.");
            }
            else
            {
                var newAccount = new Account
                {
                    Number = model.Number,
                    Company = model.Company,
                    AccountName = model.AccountName,
                    Price = model.Price,
                    Date = model.Date,
                    Status = model.Status,
                };

                await _accountsService.CreateAsync(newAccount);

                return Ok("New account created without file.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обработке файла");
            return StatusCode(StatusCodes.Status500InternalServerError, "Произошла ошибка при обработке файла");
        }
    }
}