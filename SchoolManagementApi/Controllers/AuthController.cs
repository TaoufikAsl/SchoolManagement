using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementApi.Data;
using SchoolManagementApi.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SchoolManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SchoolContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(SchoolContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            // Validation des champs de base
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            // Vérification si l'utilisateur existe déjà
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            {
                return BadRequest(new { message = "Username already exists." });
            }

            // Hachage du mot de passe
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            // Ajout de l'utilisateur à la base de données
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Création de l'entité Student ou Instructor associée en fonction du rôle
            if (user.Role == "student")
            {
                var student = new Student
                {
                    FirstName = user.Username,
                    LastName = user.Username,
                    Email = $"{user.Username}@ephec.be",
                    UserId = user.Id
                };
                _context.Students.Add(student);
            }
            else if (user.Role == "instructor")
            {
                var instructor = new Instructor
                {
                    FirstName = user.Username,
                    LastName = user.Username,
                    Email = $"{user.Username}@ephec.be",
                    UserId = user.Id
                };
                _context.Instructors.Add(instructor);
            }

            await _context.SaveChangesAsync(); // Sauvegarder les changements

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            // Log pour aider à identifier les problèmes
            Console.WriteLine($"Login received: {login.Username}");

            // Validation des champs de base
            if (string.IsNullOrWhiteSpace(login.Username) || string.IsNullOrWhiteSpace(login.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            // Recherche de l'utilisateur dans la base de données par nom d'utilisateur
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }



            // Générer un token JWT avec le rôle et autres informations
            var token = GenerateJwtToken(user);
            return Ok(new
            {
                token,
                username = user.Username,
                role = user.Role
            });
        }

        // Méthode privée pour générer un token JWT
        private string GenerateJwtToken(User user)
        {
            // Déclaration des claims
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Clé secrète pour la signature du token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Création du token JWT
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        //  Action accessible uniquement aux administrateurs
        [Authorize(Roles = "admin")]
        [HttpGet("admin-only-action")]
        public IActionResult AdminOnlyAction()
        {
            return Ok("This is an admin-only action.");
        }

        // Action accessible aux instructeurs et aux administrateurs
        [Authorize(Roles = "admin,instructor")]
        [HttpGet("instructor-or-admin-action")]
        public IActionResult InstructorOrAdminAction()
        {
            return Ok("This action is for instructors or admins.");
        }
    }
}
