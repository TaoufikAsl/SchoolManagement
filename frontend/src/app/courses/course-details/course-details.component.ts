import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/courses/course.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-details.component.html',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;  // Stocke les détails du cours
  isInstructorOrAdmin: boolean = false;  // Indique si l'utilisateur est un instructeur ou un administrateur
  isStudent: boolean = false;  // Indique si l'utilisateur est un étudiant
  updatedCourse: Course | null = null;  // Pour stocker les modifications apportées au cours
  errorMessage: string = '';  // Message d'erreur en cas de problème

  constructor(
    private route: ActivatedRoute,
    private enrollmentService: EnrollmentService, // Injecter EnrollmentService
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    
    if (courseId) {
      this.loadCourse(Number(courseId));  // Charger les détails du cours
    } else {
      console.error('Invalid course ID');
      this.router.navigate(['/courses']);  // Rediriger si l'ID est invalide
    }

    // Vérifier si l'utilisateur est admin, instructeur ou étudiant
    const currentUser = this.authService.getLoggedInUser();
    this.isInstructorOrAdmin = currentUser?.role === 'instructor' || currentUser?.role === 'admin';
    this.isStudent = currentUser?.role === 'student';
  }

  // Charger les détails d'un cours
  loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        if (course) {
          this.course = course;
          this.updatedCourse = { ...course };  // Préparer updatedCourse pour l'édition
        } else {
          console.error('Course not found');
          this.router.navigate(['/courses']);  // Rediriger si le cours n'est pas trouvé
        }
      },
      error: (err) => {
        console.error('Failed to load course', err);
        this.router.navigate(['/courses']);  // Rediriger en cas d'erreur de chargement
      },
    });
  }

  // Supprimer un cours
  deleteCourse(): void {
    if (this.course && confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(this.course.id!).subscribe({
        next: () => {
          alert('Course deleted successfully');
          this.router.navigate(['/courses']);  // Rediriger après suppression
        },
        error: (err) => console.error('Failed to delete course', err),
      });
    }
  }

  // Modifier un cours
  editCourse(): void {
    if (this.updatedCourse && confirm('Are you sure you want to update this course?')) {
      this.courseService.updateCourse(this.updatedCourse.id!, this.updatedCourse).subscribe({
        next: () => {
          alert('Course updated successfully');
          this.loadCourse(this.updatedCourse!.id!);  // Recharger les détails après modification
        },
        error: (err) => console.error('Failed to update course', err),
      });
    }
  }

  // Inscription à un cours pour les étudiants
  enrollInCourse(): void {
    const studentId = this.authService.getStudentId();
    if (studentId && this.course) {
      this.enrollmentService.enrollStudent(studentId, this.course.id!).subscribe({
        next: () => {
          alert('Enrolled in course successfully');
        },
        error: (err) => console.error('Failed to enroll in course', err),
      });
    } else {
      alert('Failed to retrieve student information or course ID');
    }
  }
}
