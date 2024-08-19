using System.ComponentModel.DataAnnotations;

namespace SchoolManagementApi.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Le titre est obligatoire.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "La description est obligatoire.")]
        public string Description { get; set; }

        public int InstructorId { get; set; }

        public Instructor? Instructor { get; set; }  // Marqué comme nullable pour éviter l'erreur
    }
}
