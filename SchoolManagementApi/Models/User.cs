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

        /* [Required(ErrorMessage = "Role is required")]
         [RegularExpression("^(admin|instructor|student)$", ErrorMessage = "Role must be either 'admin', 'instructor', or 'student'")]*/
        public string? Role { get; set; } // Role peut être null en théorie, mais l'utilisateur est obligé d'utiliser student ou instructor à la connexion

    }
}
