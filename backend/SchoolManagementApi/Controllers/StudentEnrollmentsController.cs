using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.Models;

namespace SchoolManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentEnrollmentsController : ControllerBase
    {
        private readonly SchoolContext _context;

        public StudentEnrollmentsController(SchoolContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentEnrollment>>> GetEnrollments()
        {
            return await _context.StudentEnrollments.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<StudentEnrollment>> EnrollStudent(StudentEnrollment enrollment)
        {
            _context.StudentEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEnrollments), new { id = enrollment.Id }, enrollment);
        }
    }
}
