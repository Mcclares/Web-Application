using AccountStoreApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace AccountStoreApi.Services;

public class FileService
{
    private readonly IMongoCollection<FileModel> _filesCollection;

    public FileService(
        IOptions<AccountStoreDatabaseSettings> accountStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            accountStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            accountStoreDatabaseSettings.Value.DatabaseName);

        _filesCollection = mongoDatabase.GetCollection<FileModel>(
            accountStoreDatabaseSettings.Value.FilesCollectionName);
    }


    public async Task<string> CreateAsync(IFormFile file, IWebHostEnvironment environment, string? path)
    {
        string commonPath;
        string filePathInDb;


        // List<string> validExetension = new List<string>() { ".jpg", ".pdf", ".png", "gif" };
        string extension = Path.GetExtension(file.FileName);
        // if (!validExetension.Contains(extension))
        // {
        //     return $"Extension is not valid ({string.Join(',', validExetension)})";
        // }

        // file size
        long size = file.Length;
        if (size > (20 * 1024 * 1024))
        {
            return "Maximum size can be 2mb";
        }

        //name changing in uniqueFile
        string uniqueFileName = Guid.NewGuid().ToString() + extension;


        if (path == null)
        {
            commonPath = Path.Combine(environment.ContentRootPath, "WorkingFiles");

            filePathInDb = "WorkingFiles\\" + uniqueFileName;
        }
        else
        {
            commonPath = Path.Combine(environment.ContentRootPath, "WorkingFiles", path);
            //делаем отдельную переменную для сохранения пути в базе данных
            var pathForDB = path.Replace('/', '\\');
            filePathInDb = "WorkingFiles\\" + pathForDB + '\\' + uniqueFileName;
        }

        using FileStream stream = new FileStream(Path.Combine(commonPath, uniqueFileName), FileMode.Create);
        file.CopyTo(stream);

        FileModel fileModel = new FileModel();
        // fileModel.FileFolder = folderName;
        fileModel.OldName = file.FileName;
        fileModel.FilePath = filePathInDb;
        fileModel.FileName = uniqueFileName;
        await _filesCollection.InsertOneAsync(fileModel);
        return uniqueFileName;
    }

    public async Task<FileModel> GetFileAsyncById(string id) =>
        await _filesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    //Поиск в базе данных по именнам    
    public async Task<FileModel> GetFileAsyncByFileName(string fileName) =>
        await _filesCollection.Find(x => x.FileName == fileName).FirstOrDefaultAsync();

    public async Task RemoveAsyncByName(string fileName) =>
        await _filesCollection.DeleteOneAsync(x => x.FileName == fileName);


    public async Task<FileModel> GetFileAsyncByNameModel(string name) =>
        await _filesCollection.Find(x => x.OldName == name).FirstOrDefaultAsync();

    public async Task<string> GetFileAsyncByName(string fileName)
    {
        var file = await _filesCollection.Find(x => x.FileName == fileName).FirstOrDefaultAsync();
        return file?.OldName!; // Используйте null-conditional оператор, чтобы избежать ошибок при отсутствии файла
    }

    public async Task<List<FileModel>> GetAsync() =>
        await _filesCollection.Find(_ => true).ToListAsync();

    public async Task RemoveAsync(string id) =>
        await _filesCollection.DeleteOneAsync(x => x.Id == id);

    public async Task<bool> DeleteFolderAsync(string? path, IWebHostEnvironment _environment)
    {
        try
        {
            string folderPath;
            if (path == null)
            {
                folderPath = Path.Combine(_environment.ContentRootPath, "WorkingFiles");
            }
            else
            {
                folderPath = Path.Combine(_environment.ContentRootPath, "WorkingFiles", path);
            }

            if (Directory.Exists(folderPath))
            {
                await DeleteFilesAndSubfolders(folderPath);

                // Delete the root folder
                Directory.Delete(folderPath, true); // true for recursive deletion
                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Error deleting folder: {ex.Message}");
            return false;
        }
    }


    private async Task DeleteFilesAndSubfolders(string folderPath)
    {
        // Delete all files in the directory
        var filesInDirectory = Directory.GetFiles(folderPath);
        foreach (var file in filesInDirectory)
        {
            var fileName = Path.GetFileName(file);
            var fileModel = await GetFileAsyncByFileName(fileName);
            if (fileModel != null)
            {
                await RemoveAsyncByName(fileName);
            }
        }

        // Recurse into subdirectories
        var subdirectories = Directory.GetDirectories(folderPath);
        foreach (var subdirectory in subdirectories)
        {
            await DeleteFilesAndSubfolders(subdirectory);
        }
    }
}