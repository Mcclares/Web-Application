using AccountStoreApi.Models;

public class UploadAccount
{
    public Account? Account { get; set; } // Модель аккаунта

    // Дополнительные поля для загрузки файла, если нужно
    public IFormFile? File { get; set; }
}