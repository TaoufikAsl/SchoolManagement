import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course-list',
  standalone: true,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule, 
    MatSnackBarModule 
  ]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  newCourse: Course = { title: '', description: '', instructorId: 0 }; 
  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        this.showSnackbar('Failed to load courses');
        console.error('Failed to load courses', error);
      }
    });
  }

  createCourse(courseForm: any) {
    const instructorId = this.authService.getInstructorId();

    if (instructorId === null) {
      this.showSnackbar('Failed to identify instructor');
      return;
    }

    this.newCourse.instructorId = instructorId;

    if (this.newCourse.title && this.newCourse.description) {
      this.courseService.createCourse(this.newCourse).subscribe({
        next: (response) => {
          this.courses.push(response);
          this.newCourse = { title: '', description: '', instructorId: instructorId };
          courseForm.resetForm();
          this.showSnackbar('Course created successfully');
        },
        error: (error) => {
          this.showSnackbar('Failed to create course');
          console.error('Failed to create course', error);
        }
      });
    }
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
