using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementApi.Data;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Cl� secr�te pour la signature des tokens JWT
// Cette cl� doit �tre longue et complexe pour des raisons de s�curit� (minimum 32 caract�res pour HS256).
var key = Encoding.ASCII.GetBytes("notre_cl�_de_32_caract�res_minimum_pour_HS256!");

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
        IssuerSigningKey = new SymmetricSecurityKey(key), // Utiliser la cl� de signature sym�trique d�finie plus haut
        ValidateIssuer = true,                       // Valider l'�metteur du jeton
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // Sp�cifier l'�metteur valide
        ValidateAudience = true,                     // Valider l'audience du jeton
        ValidAudience = builder.Configuration["Jwt:Audience"], // Sp�cifier l'audience valide
        ValidateLifetime = true,                     // Valider la dur�e de vie du jeton
        ClockSkew = TimeSpan.Zero                    // R�duire la marge de tol�rance � z�ro pour la validit� du jeton
    };
});

// Ajouter les services au conteneur d'injection de d�pendances
builder.Services.AddControllers();
builder.Services.AddDbContext<SchoolContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // Configurer Entity Framework pour utiliser SQL Server
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
