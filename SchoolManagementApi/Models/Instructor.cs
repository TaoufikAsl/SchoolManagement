using SchoolManagementApi.Models;
using System.Collections.Generic;

public class Instructor
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public int UserId { get; set; } // Liaison avec l'utilisateur
    public User User { get; set; } // Propriété de navigation vers User
    public ICollection<Course> Courses { get; set; } // Liste des cours assignés


    public Instructor() //initialisation de la liste des cours garantit que la collection n'est jamais nulle
    {
        Courses = new List<Course>();
    }
}
