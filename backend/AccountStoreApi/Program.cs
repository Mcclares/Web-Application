using Microsoft.Extensions.FileProviders;
using MongoAuthenticatorAPI.Models;
using AccountStoreApi.Models;
using AccountStoreApi.Services;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using AspNetCore.Identity.MongoDbCore.Infrastructure;
using Microsoft.AspNetCore.Identity;
using AspNetCore.Identity.MongoDbCore.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Driver;



var builder = WebApplication.CreateBuilder(args);
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);

BsonSerializer.RegisterSerializer(new GuidSerializer(MongoDB.Bson.BsonType.String));
BsonSerializer.RegisterSerializer(new DateTimeSerializer(MongoDB.Bson.BsonType.String));
BsonSerializer.RegisterSerializer(new DateTimeOffsetSerializer(MongoDB.Bson.BsonType.String));

var mongoDbIdentifyConfig = new MongoDbIdentityConfiguration
{
    MongoDbSettings = new MongoDbSettings
    {
        ConnectionString = "mongodb://mongodb:27017",
        DatabaseName = "Obd2Data"
    },
    IdentityOptionsAction = options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireLowercase = false;
   
        //Lockout
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;

        options.User.RequireUniqueEmail = true;
       
    }
};

builder.Services.ConfigureMongoDbIdentity<ApplicationUser, ApplicationRole, Guid>(mongoDbIdentifyConfig)
    .AddUserManager<UserManager<ApplicationUser>>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddRoleManager<RoleManager<ApplicationRole>>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = true;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    }
);


builder.Services.Configure<AccountStoreDatabaseSettings>(
    builder.Configuration.GetSection("AccountStoreDatabase"));

builder.Services.AddSingleton<AccountsService>();
builder.Services.AddSingleton<FileService>();



builder.Services.AddSingleton<IMongoDatabase>(provider =>
{
    var mongoDbSettings = provider.GetRequiredService<MongoDbSettings>();
    var client = new MongoClient(mongoDbSettings.ConnectionString);
    return client.GetDatabase(mongoDbSettings.DatabaseName);
});
builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

builder.Services.AddEndpointsApiExplorer();

// Этот метод добавляет службы для интеграции с ASP.NET Core Endpoint Routing и API Explorer. API Explorer предоставляет
//  информацию о маршрутах и конечных точках вашего API. Это важно для инструментов автоматизации, таких как Swagger.        
builder.Services.AddEndpointsApiExplorer();

// Этот метод добавляет службы для генерации Swagger-спецификации (OpenAPI) для вашего API. Swagger предоставляет 
// интерактивную документацию для вашего API, позволяя разработчикам легко понимать и протестировать ваши API-маршруты.
builder.Services.AddSwaggerGen();

//Логирование
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConfiguration(builder.Configuration.GetSection("Logging"));
    loggingBuilder.AddConsole();
    loggingBuilder.AddDebug();
});



builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

// Строим веб-приложение
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policyBuilder =>
    {
        policyBuilder.WithOrigins(builder.Configuration["FrontendIp"]!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    }
);



app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
// Конструкция app.Use(async (context, next) => { await next(); }); 
// обычно используется для внесения пользовательской логики или выполнения 
// каких-то действий во время обработки запроса до того, как запрос достигнет 
// контроллера или других компонентов в обработке запроса.

app.Use(async (context, next) => { await next(); });


// CORS (Cross-Origin Resource Sharing) — это механизм в веб-браузерах, который позволяет веб-страницам запрашивать ресурсы с другого домена, чем тот, с которого была загружена исходная веб-страница. Без CORS браузеры применяют Same-Origin Policy, 
// которая предотвращает запросы к ресурсам на других доменах из-за безопасности.

var webHostEnvironment = app.Services.GetService<IWebHostEnvironment>();
if (webHostEnvironment != null)
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(webHostEnvironment.ContentRootPath, "AccountsFiles")),
        RequestPath = "/AccountsFiles"
    });
    // app.UseStaticFiles(new StaticFileOptions
    // {
    //     FileProvider = new PhysicalFileProvider(Path.Combine(webHostEnvironment.ContentRootPath, "WorkingFiles")),
    //     RequestPath = "/WorkingFiles"
    // });
    
    
}

app.MapControllerRoute(
    name: "files_route",
    pattern: "api/files/{fileName}",
    defaults: new { controller = "Files", action = "GetFile" });
app.MapControllers();
app.Run();


