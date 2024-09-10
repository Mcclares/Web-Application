using AccountStoreApi.Models;
using AccountStoreApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

//Контроллер для загрузики и выгрузки, также создания папок на сервере. 
//Так как это первый и серьезный, это первая реализация папок и файлов, как в файловой системе,
//если не будет места хватать арендей Amazon s3 и подключи к ним. 

namespace AccountStoreApi.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FileController : ControllerBase
    {
        private readonly FileService _fileService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileController> _logger;

        public FileController(FileService fileService, IWebHostEnvironment environment, ILogger<FileController> logger)
        {
            _fileService = fileService;
            _environment = environment;
            _logger = logger;
        }

        //Получение всех файлов (не реализован, так как не нужен)
        // [HttpGet]
        // public async Task<List<FileModel>> Get() =>
        //     await _fileService.GetAsync();


        //Загрузка файлов
        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string? Path)
        {
            var currentFile = await _fileService.CreateAsync(file, _environment, Path);
            return Ok(currentFile);
        }

        //Реализация скачивая файла
        [Authorize]
        [HttpGet("download/{fileName}")]
        public async Task<IActionResult> GetFile(string fileName, [FromQuery] string? path)
        {
            try
            {
                string filePath;
                var realName = _fileService.GetFileAsyncByNameModel(fileName).Result.FileName;
                if (path == null)
                {
                    filePath = Path.Combine(_environment.ContentRootPath, "WorkingFiles", realName);
                }
                else
                {
                    filePath = Path.Combine(_environment.ContentRootPath, "WorkingFiles", path, realName);
                }

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                var fileBytes = await Task.Run(() => System.IO.File.ReadAllBytes(filePath));
                return File(fileBytes, "application/octet-stream", fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(StatusCodes.Status500InternalServerError, "Ошибка чтения файла");
            }
        }

        //Создание новой папки
        [Authorize] //Для того, чтобы не смог получить доступ из вне
        [HttpPost("create-folder")]
        public async Task<IActionResult> CreateFolder(string folderName, [FromQuery] string? path)
        {
            string folderPath;
            if (path == null)
            {
                folderPath = Path.Combine(_environment.ContentRootPath, "WorkingFiles", folderName);
            }
            else
            {
                folderPath = Path.Combine(_environment.ContentRootPath, "WorkingFiles", path, folderName);
            }

            if (!Directory.Exists(folderPath))
            {
                await Task.Run(() => Directory.CreateDirectory(folderPath));
                return Ok(new { message = "Folder created successfully" });
            }

            return BadRequest(new { message = "Folder already exists" });
        }

        //Получение папок и файлов в определенной папке
        [Authorize]
        [HttpGet("folders-and-files")]
        public async Task<IActionResult> GetFoldersAndFiles([FromQuery] string? path)
        {
            try
            {
                string directoryPath = "";
                if (path != null)
                {
                    directoryPath = Path.Combine(_environment.ContentRootPath, "WorkingFiles", path);
                }
                else
                {
                    directoryPath = Path.Combine(_environment.ContentRootPath, "WorkingFiles");
                }

                if (!Directory.Exists(directoryPath))
                {
                    return NotFound("Directory not found.");
                }

                var folders = new List<string>();
                var directories = await Task.Run(() => Directory.GetDirectories(directoryPath));
                foreach (var dir in directories)
                {
                    folders.Add(Path.GetFileName(dir));
                }

                var files = new List<FileModel>();
                var filePaths = await Task.Run(() => Directory.GetFiles(directoryPath));
                foreach (var filePath in filePaths)
                {
                    var fileName = await _fileService.GetFileAsyncByName(Path.GetFileName(filePath));
                    files.Add(new FileModel
                    {
                        OldName = fileName,
                        FileFolder = Path.GetDirectoryName(filePath),
                        FileName = Path.GetFileName(filePath),
                        FilePath = filePath,
                    });
                }

                return Ok(new { folders, files });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        //Удаление папки, вызывает рекурсию которая удаляет содержимое папки
        [Authorize]
        [HttpDelete("delete-folder")]
        public async Task<IActionResult> DeleteFolder([FromQuery] string path)
        {
            var result = await _fileService.DeleteFolderAsync(path, _environment);
            if (result)
            {
                return Ok(new { message = "Folder deleted successfully" });
            }

            return NotFound(new { message = "Folder not found" });
        }

        //Удаления файла
        [Authorize]
        [HttpDelete("{fileName}")]
        public async Task<IActionResult> Delete(string fileName)
        {
            var file = await _fileService.GetFileAsyncByFileName(fileName);

            if (file is null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(file.FileName))
            {
                // Delete the file from the file system
                try
                {
                    string filePath = Path.Combine(_environment.ContentRootPath, file.FilePath!);
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    // Handle file deletion errors
                    _logger.LogError(ex, "Error deleting file");
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        "An error occurred while deleting the file");
                }
            }

            await _fileService.RemoveAsyncByName(fileName);

            return NoContent();
        }
    }
}