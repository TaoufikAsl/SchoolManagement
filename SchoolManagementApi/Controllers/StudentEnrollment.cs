using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.Models;
using System.Collections.Generic;
using System.Linq;
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
        return await _context.StudentEnrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "admin,instructor,student")]
    public async Task<ActionResult<StudentEnrollment>> EnrollStudent(EnrollStudentDto enrollmentDto)
    {
        // Vérifier si l'étudiant existe
        var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == enrollmentDto.StudentId);
        if (student == null)
        {
            return NotFound("Student not found");
        }

        // Vérifier si le cours existe
        var course = await _context.Courses.FindAsync(enrollmentDto.CourseId);
        if (course == null)
        {
            return NotFound("Course not found");
        }

        // Vérifier si l'étudiant est déjà inscrit à ce cours
        var existingEnrollment = await _context.StudentEnrollments
            .FirstOrDefaultAsync(e => e.StudentId == enrollmentDto.StudentId && e.CourseId == enrollmentDto.CourseId);

        if (existingEnrollment != null)
        {
            return BadRequest("Student is already enrolled in this course.");
        }

        // Créer une nouvelle inscription
        var enrollment = new StudentEnrollment
        {
            StudentId = enrollmentDto.StudentId,
            CourseId = enrollmentDto.CourseId,
        };

        _context.StudentEnrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        // Retourner une réponse 201 Created avec l'URL de la ressource nouvellement créée
        return CreatedAtAction(nameof(GetEnrollments), new { id = enrollment.Id }, enrollment);
    }

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



    // GET api/StudentEnrollments/student/{studentId}/courses
    [HttpGet("student/{studentId}/courses")]
    [Authorize(Roles = "admin,instructor,student")]
    public async Task<ActionResult<IEnumerable<Course>>> GetStudentCourses(int studentId)
    {
        var student = await _context.Students
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Course)
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student == null)
        {
            return NotFound("Student not found");
        }

        var enrolledCourses = student.Enrollments.Select(e => e.Course).ToList();

        return Ok(enrolledCourses);
    }

    [HttpGet("studentByUserId/{userid}")]
    [Authorize(Roles = "admin,instructor,student")]

    public async Task<ActionResult<Student>> GetStudentByUserID(int userId)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
        {
            return NotFound("Student not found");
        }

        return Ok(student);
    }

}

