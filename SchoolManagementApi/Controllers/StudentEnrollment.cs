using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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
    [Authorize(Roles = "admin,instructor")]
    public async Task<ActionResult<IEnumerable<StudentEnrollment>>> GetEnrollments()
    {
        return await _context.StudentEnrollments.ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "admin,instructor,student")]  // Ajout du rôle "student"
    public async Task<ActionResult<StudentEnrollment>> EnrollStudent(StudentEnrollment enrollment)
    {
        _context.StudentEnrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEnrollments), new { id = enrollment.Id }, enrollment);
    }

    // Ajoutez une méthode DELETE si nécessaire pour permettre aux étudiants de se désinscrire
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,instructor,student")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        var enrollment = await _context.StudentEnrollments.FindAsync(id);
        if (enrollment == null)
            return NotFound();

        _context.StudentEnrollments.Remove(enrollment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
