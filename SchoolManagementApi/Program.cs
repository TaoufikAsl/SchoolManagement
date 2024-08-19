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

// Configuration de CORS pour permettre les requêtes provenant du frontend (Angular)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200") // Autoriser uniquement les requêtes provenant du frontend Angular
                   .AllowAnyHeader()                    // Autoriser tous les en-têtes HTTP
                   .AllowAnyMethod();                   // Autoriser toutes les méthodes HTTP (GET, POST, etc.)
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
        ValidateIssuerSigningKey = true,             // Valider la clé de signature du jeton
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])), // Utiliser la clé de signature symétrique définie plus haut
        ValidateIssuer = true,                       // Valider l'émetteur du jeton
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // Spécifier l'émetteur valide
        ValidateAudience = true,                     // Valider l'audience du jeton
        ValidAudience = builder.Configuration["Jwt:Audience"], // Spécifier l'audience valide
        ValidateLifetime = true,                     // Valider la durée de vie du jeton
        ClockSkew = TimeSpan.Zero,                   // Réduire la marge de tolérance à zéro pour la validité du jeton
        RoleClaimType = ClaimTypes.Role              // Spécifier le type de revendication de rôle
    };
});

// Ajouter les services au conteneur d'injection de dépendances
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

// Appliquer la politique CORS définie plus haut
app.UseCors("AllowSpecificOrigin");

// Activer l'authentification
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


app.Run();
