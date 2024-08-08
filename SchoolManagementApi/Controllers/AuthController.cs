using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.Models;
using System.Threading.Tasks;

namespace SchoolManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SchoolContext _context;

        public AuthController(SchoolContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username && u.Password == login.Password);
            if (user == null)
                return Unauthorized();
            return Ok(user);
        }
    }
}
