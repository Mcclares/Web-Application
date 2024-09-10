using AccountStoreApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace AccountStoreApi.Services;

public class AccountsService
{
    private readonly IMongoCollection<Account> _accountsCollection;
    

    public AccountsService(
        IOptions<AccountStoreDatabaseSettings> accountStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            accountStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            accountStoreDatabaseSettings.Value.DatabaseName);

        _accountsCollection = mongoDatabase.GetCollection<Account>(
            accountStoreDatabaseSettings.Value.AccountsCollectionName);


    }

    public async Task<List<Account>> GetAsync() =>
        await _accountsCollection.Find(_ => true).ToListAsync();

    public async Task<Account?> GetAsync(string id) =>
        await _accountsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Account newAccount) =>
        await _accountsCollection.InsertOneAsync(newAccount);

    public async Task UpdateAsync(string id, Account updatedAccount) =>
        await _accountsCollection.ReplaceOneAsync(x => x.Id == id, updatedAccount);

    public async Task RemoveAsync(string id) =>
        await _accountsCollection.DeleteOneAsync(x => x.Id == id);


   
}