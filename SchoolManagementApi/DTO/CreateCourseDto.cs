namespace SchoolManagementApi.DTO
{
    public class CreateCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int InstructorId { get; set; }
        public int Id { get; set; }
    }

}
