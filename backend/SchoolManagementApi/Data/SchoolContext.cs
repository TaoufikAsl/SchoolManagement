using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Models;

namespace SchoolManagementApi.Data
{
    public class SchoolContext : DbContext
    {
        public SchoolContext(DbContextOptions<SchoolContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<StudentEnrollment> StudentEnrollments { get; set; }
    }
}
