import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-create',
  standalone: true,
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ]
})
export class CourseCreateComponent {
  newCourse: Course = { title: '', description: '', instructorId: 0 }; // Assure que instructorId ne soit pas null
  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Méthode pour créer un cours
  createCourse() {
    const instructorId = this.authService.getInstructorId(); // Récupérer l'ID de l'instructeur connecté

    if (instructorId === null) {
      this.errorMessage = 'Unable to identify the logged-in instructor.';
      return;
    }

    // Associer l'instructorId au nouveau cours
    this.newCourse.instructorId = instructorId;

    // Envoyer la requête de création du cours
    this.courseService.createCourse(this.newCourse).subscribe({
      next: (response) => {
        this.showSnackbar('Course created successfully');
        this.router.navigate(['/courses/list']); // Rediriger vers la liste des cours après la création
      },
      error: (error) => {
        this.errorMessage = 'Failed to create course. Please try again.';
        console.error('Error creating course:', error);
      }
    });
  }

  // Méthode pour afficher une notification avec SnackBar
  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000 // Durée d'affichage de 3 secondes
    });
  }
}
