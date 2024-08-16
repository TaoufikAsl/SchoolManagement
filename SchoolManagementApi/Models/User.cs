using System.ComponentModel.DataAnnotations;

namespace SchoolManagementApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } // Usernam ne peut pas être null

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } // MDP ne peut pas être null

        [Required(ErrorMessage = "Role is required")]
        [RegularExpression("^(admin|instructor|student)$", ErrorMessage = "Role must be either 'admin', 'instructor', or 'student'")]
        public string Role { get; set; } // Role ne peut pas être null et doit être valide


    }
}
