import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Course } from "../../models/courses/course.model";
import { CourseService } from "../../services/course.service";
import { AuthService } from "../../services/auth.service";
import { NewCourse } from "../../models/courses/new-course";

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  currentCourse: NewCourse = { title: '', description: '', instructorId: 0 };
  loading = false;
  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.setInstructorId();
  }

  setInstructorId() {
    const instructorId = this.authService.getInstructorId();
    if (instructorId !== null && instructorId !== undefined) {
      this.currentCourse.instructorId = instructorId;
    } else {
      this.showSnackbar('Failed to retrieve instructor ID');
    }
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => this.handleError('Failed to load courses', error)
    });
  }

  createOrUpdateCourse() {
    if (!this.currentCourse.title || !this.currentCourse.description) {
      this.showSnackbar('Title and description are required');
      return;
    }

    // Vérifiez si c'est une création ou une mise à jour
    const courseToSave: NewCourse | Course = this.currentCourse as Course;
    
    if ((courseToSave as Course).id) {
      this.updateCourse(courseToSave as Course);
    } else {
      this.createCourse(this.currentCourse);
    }
  }

  createCourse(course: NewCourse) {
    this.courseService.createCourse(course).subscribe({
      next: (response: Course) => {
        this.courses.push(response);
        this.showSnackbar('Course created successfully');
        this.resetCurrentCourse();
      },
      error: (error) => this.handleError('Failed to create course', error)
    });
  }

  updateCourse(course: Course) {
    this.courseService.updateCourse(course.id!, course).subscribe({
      next: () => {
        this.loadCourses();
        this.showSnackbar('Course updated successfully');
        this.resetCurrentCourse();
      },
      error: (error) => this.handleError('Failed to update course', error)
    });
  }

  editCourse(course: Course) {
    // Pour l'édition, nous devons copier toutes les propriétés, y compris l'ID
    this.currentCourse = { ...course };
  }

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== id);
          this.showSnackbar('Course deleted successfully');
        },
        error: (error) => this.handleError('Failed to delete course', error)
      });
    }
  }

  resetCurrentCourse() {
    // Après la création ou la mise à jour, réinitialisez le formulaire
    this.currentCourse = { title: '', description: '', instructorId: this.currentCourse.instructorId };
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.errorMessage = message;
    this.showSnackbar(message);
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
