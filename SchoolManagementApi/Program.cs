using Microsoft.AspNetCore.Builder; // Ajoutez cette directive
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection; // Ajoutez cette directive si n�cessaire
using Microsoft.Extensions.Hosting; // Ajoutez cette directive
using SchoolManagementApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>  //Mani�re de me permettre d'envoyer les requetes du front vers le back
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Ajouter les services au conteneur.
builder.Services.AddControllers();
builder.Services.AddDbContext<SchoolContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurer le pipeline de requ�tes HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("AllowSpecificOrigin");//li� aux requ�tes du front

app.UseAuthorization();

app.MapControllers();

app.Run();
