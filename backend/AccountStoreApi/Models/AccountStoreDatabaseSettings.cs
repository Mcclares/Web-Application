namespace AccountStoreApi.Models;

public class AccountStoreDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string AccountsCollectionName { get; set; } = null!;
    public string UsersCollectionName { get; set; } = null!;
    public string RolesCollectionName { get; set; } = null!;
    public string FilesCollectionName { get; set; } = null!;

}