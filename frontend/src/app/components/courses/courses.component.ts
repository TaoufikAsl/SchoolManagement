import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importer AuthService pour récupérer l'instructorId

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  currentCourse: Course = { title: '', description: '', instructorId: 0 }; // Ajouter instructorId
  loading = false;
  errorMessage = '';

  constructor(
    private courseService: CourseService, 
    private snackBar: MatSnackBar,
    private authService: AuthService // Injecter AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.setInstructorId(); // Définir l'instructorId au chargement
  }

  // Récupérer l'instructorId à partir d'AuthService
  setInstructorId() {
    const instructorId = this.authService.getInstructorId();
if (instructorId !== null && instructorId !== undefined) {
  this.currentCourse.instructorId = instructorId;
}

  }

  // Méthode pour charger la liste des cours 
  loadCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => {
        this.handleError('Failed to load courses', error);
        this.loading = false;
      }
    });
  }

  // Méthode pour créer ou mettre à jour un cours
  createOrUpdateCourse() {
    if (this.currentCourse.id) {
      this.updateCourse(this.currentCourse);
    } else {
      this.createCourse(this.currentCourse);
    }
  }

  // Méthode pour créer un nouveau cours
  createCourse(course: Course) {
    this.courseService.createCourse(course).subscribe({
      next: (response) => {
        this.courses.push(response);
        this.showSnackbar('Course created successfully');
        this.resetCurrentCourse();
      },
      error: (error) => this.handleError('Failed to create course', error)
    });
  }

  // Méthode pour mettre à jour un cours existant
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

  // Méthode pour sélectionner un cours pour l'édition
  editCourse(course: Course) {
    this.currentCourse = { ...course }; // Clone le cours sélectionné pour l'édition
  }

  // Méthode pour supprimer un cours
  deleteCourse(id: number) {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter(course => course.id !== id);
        this.showSnackbar('Course deleted successfully');
      },
      error: (error) => this.handleError('Failed to delete course', error)
    });
  }

  // Réinitialise le formulaire après la création ou la mise à jour
  resetCurrentCourse() {
    this.currentCourse = { title: '', description: '', instructorId: this.currentCourse.instructorId };
  }

  // Gestion des erreurs
  private handleError(message: string, error: any) {
    console.error(message, error);
    this.errorMessage = message;
    this.showSnackbar(message);
  }

  // Afficher une notification avec Snackbar
  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
