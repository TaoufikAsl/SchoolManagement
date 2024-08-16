using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Par défaut, tout utilisateur authentifié peut accéder à ce contrôleur
    public class StudentsController : ControllerBase
    {
        private readonly SchoolContext _context;

        public StudentsController(SchoolContext context)
        {
            _context = context;
        }

        // retourne tous les students
        [HttpGet]
        [Authorize(Roles = "admin,instructor")] // Seulement les administrateurs et les instructeurs peuvent voir tous les étudiants
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        // Retourne un student
        [HttpGet("{id}")]
        [Authorize] // Tout utilisateur authentifié peut voir les détails d'un étudiant
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // Créer student
        [HttpPost]
        [Authorize(Roles = "admin,instructor")] // Seuls les administrateurs et les instructeurs peuvent créer des étudiants
        public async Task<ActionResult<Student>> CreateStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        // MAJ student
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,instructor")] // Seuls les administrateurs et les instructeurs peuvent mettre à jour les étudiants
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            if (id != student.Id)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE Student
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Seuls les administrateurs peuvent supprimer des étudiants
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Id == id);
        }
    }
}
