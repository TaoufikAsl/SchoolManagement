using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementApi.Data;
using Serilog;
using System;
using System.Security.Claims;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Configuration de la journalisation
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
//SERILOG
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day);
});

// Configuration de CORS pour permettre les requ�tes provenant du frontend (Angular)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200") // Autoriser uniquement les requ�tes provenant du frontend Angular
                   .AllowAnyHeader()                    // Autoriser tous les en-t�tes HTTP
                   .AllowAnyMethod();                   // Autoriser toutes les m�thodes HTTP (GET, POST, etc.)
        });
});

// Ajouter l'authentification JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,             // Valider la cl� de signature du jeton
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])), // Utiliser la cl� de signature sym�trique d�finie plus haut
        ValidateIssuer = true,                       // Valider l'�metteur du jeton
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // Sp�cifier l'�metteur valide
        ValidateAudience = true,                     // Valider l'audience du jeton
        ValidAudience = builder.Configuration["Jwt:Audience"], // Sp�cifier l'audience valide
        ValidateLifetime = true,                     // Valider la dur�e de vie du jeton
        ClockSkew = TimeSpan.Zero,                   // R�duire la marge de tol�rance � z�ro pour la validit� du jeton
        RoleClaimType = ClaimTypes.Role              // Sp�cifier le type de revendication de r�le
    };
});

// Ajouter les services au conteneur d'injection de d�pendances
builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddDbContext<SchoolContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // Configurer Entity Framework pour utiliser SQL Server
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration de Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseRouting();

// Appliquer la politique CORS d�finie plus haut
app.UseCors("AllowSpecificOrigin");

// Activer l'authentification
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


app.Run();
