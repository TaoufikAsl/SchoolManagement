using SchoolManagementApi.Models;
using System.Collections.Generic;

public class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }

    public int UserId { get; set; } //Lien avec utilisateur
    public User User { get; set; } // navigation vers User

    // Liste des Enrollments pour les cours
    public ICollection<StudentEnrollment> Enrollments { get; set; }

    public Student()
    {
        Enrollments = new List<StudentEnrollment>();
    }
}
