using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTO;
using SchoolManagementApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


[Route("api/[controller]")]
[ApiController]
public class CoursesController : ControllerBase
{
    private readonly ILogger<CoursesController> _logger;
    private readonly SchoolContext _context;

    public CoursesController(SchoolContext context, ILogger<CoursesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "admin,instructor,student")]
    public async Task<ActionResult<IEnumerable<CreateCourseDto>>> GetCourses()
    {
        _logger.LogInformation("GetCourses called");
        var user = HttpContext.User;

        _logger.LogInformation("User {0} with roles {1} is attempting to access /courses", user.Identity.Name, string.Join(",", user.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value)));


        var courses = await _context.Courses
            .Select(course => new CreateCourseDto
            {

                Title = course.Title,
                Description = course.Description,
                InstructorId = course.InstructorId,
                Id = course.Id

            })
            .ToListAsync();

        return Ok(courses);
    }

    [HttpPost]
    [Authorize(Roles = "admin,instructor")]
    public async Task<ActionResult<CreateCourseDto>> CreateCourse(CreateCourseDto courseDto)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var instructor = await _context.Instructors.FirstOrDefaultAsync(i => i.UserId == courseDto.InstructorId);
        if (instructor == null)
        {
            return BadRequest("L'instructeur spécifié n'existe pas.");
        }

        // Création de l'entité Course à partir du DTO
        var course = new Course
    {
            Title = courseDto.Title,
            Description = courseDto.Description,
            InstructorId = instructor.Id
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        // Mise à jour du DTO avec l'ID généré
        courseDto.InstructorId = course.Id;

        return CreatedAtAction(nameof(GetCourses), new { id = course.Id }, courseDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,instructor")]
    public async Task<IActionResult> UpdateCourse(int id, CreateCourseDto courseDto)
    {
        // Supposons que l'ID passé en paramètre est l'ID du cours
        var course = await _context.Courses.FindAsync(id); // Rechercher le cours par ID
        if (course == null)
    {
            return NotFound(); // Si le cours n'existe pas
        }

        // Mettre à jour les propriétés du cours à partir du DTO
        course.Title = courseDto.Title;
        course.Description = courseDto.Description;

        _context.Entry(course).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync(); // Sauvegarder les modifications
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Courses.Any(e => e.Id == id)) // Vérifier si le cours existe toujours
            {
                return NotFound();
            }
            else
            {
                throw;
        }
        }

        return NoContent(); // Réponse sans contenu pour indiquer que la mise à jour est réussie
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return NotFound();

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
