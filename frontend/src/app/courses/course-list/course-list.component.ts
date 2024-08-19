import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/courses/course.model';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NewCourse } from '../../models/courses/new-course';
import { EnrollmentService } from '../../services/enrollment.service';

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
  enrolledCourses: Course[] = []; // Pour stocker les cours inscrits de l'étudiant
  newCourse: NewCourse = { title: '', description: '', instructorId: 0 };
  errorMessage = '';
  isInstructor = false;
  userRole = ''; // Pour stocker le rôle de l'utilisateur
  userId = 0; // ID de l'utilisateur connecté (étudiant ou instructeur)
  enrollments: any[] = [];
  


  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadCourses();
    if (this.userRole === 'student') {
      this.loadEnrolledCourses(); // Charger les cours où l'étudiant est inscrit
    }
  }

  // Vérifie le rôle de l'utilisateur et récupère l'ID de l'utilisateur
  checkUserRole() {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.userRole = user.role || '';
      this.isInstructor = this.userRole === 'instructor';
      this.userId = user.id; // Assigner l'ID de l'utilisateur connecté
    }
  }

  // Charge tous les cours disponibles
  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cours', error);
      },
      complete: () => {
        console.log('Récupération des cours terminée');
      }
    });
  }

  // Charge les cours où l'étudiant est inscrit
   loadEnrolledCourses(): void {
    const user = this.authService.getLoggedInUser();
    if (user && user.id) {
     const studentId= this.enrollmentService.getStudentId(user.id)
      console.log('studentIdUser',studentId)
       this.enrollmentService.getStudentCourses(studentId).subscribe({
        next: (courses: Course[]) => {
          this.enrolledCourses = courses;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des cours inscrits', error);
        }
      });
    } else {
      console.error('Utilisateur non connecté ou ID invalide');
    }
  }
  

  // Vérifie si l'étudiant est déjà inscrit à un cours
  isEnrolled(courseId: number): boolean {
    return this.enrolledCourses.some(course => course.id === courseId);
  }

  // Méthode pour créer un cours (pour les instructeurs)
  createCourse(courseForm: any) {
    const instructorId = this.authService.getInstructorId();
    if (!instructorId) {
      this.showSnackbar('Échec de l\'identification de l\'instructeur');
      return;
    }

    const courseDto: NewCourse = {
      title: this.newCourse.title,
      description: this.newCourse.description,
      instructorId: instructorId
    };

    if (courseDto.title && courseDto.description) {
      this.courseService.createCourse(courseDto).subscribe({
        next: (response) => {
          this.courses.push(response);
          this.newCourse = { title: '', description: '', instructorId: instructorId };
          courseForm.resetForm();
          this.showSnackbar('Cours créé avec succès');
        },
        error: (error) => {
          this.showSnackbar('Échec de la création du cours');
          console.error('Échec de la création du cours', error);
        }
      });
    }
  }

  // Inscription d'un étudiant à un cours
  enrollStudent(courseId: number) {
    const studentId= this.enrollmentService.getStudentId(this.userId)
    if (!studentId) {
      this.showSnackbar('Erreur : impossible d\'identifier l\'étudiant');
      return;
    }
    console.log('COURS ID',courseId)
    this.enrollmentService.enrollStudent(studentId, courseId).subscribe({
      next: () => { 
        this.showSnackbar('Inscription réussie');
        this.loadEnrolledCourses(); // Recharger les cours inscrits
      },
      error: (err) => this.handleError('Erreur lors de l\'inscription', err)
    });
  }

  // Désinscription d'un étudiant d'un cours
  unenroll(courseId: number) {
    const enrollmentId = this.getEnrollmentIdForCourse(courseId);
    
    if (enrollmentId !== undefined) {
      this.enrollmentService.unenrollStudent(enrollmentId).subscribe(
        () => {
          console.log(`Successfully unenrolled from course ${courseId}`);
          // Logique pour mettre à jour l'interface utilisateur ou rafraîchir la liste des cours
        },
        error => {
          console.error('Failed to unenroll:', error);
        }
      );
    } else {
      this.handleError('Impossible de trouver l\'ID d\'inscription pour ce cours', {});
    }
  }

  getEnrollmentIdForCourse(courseId: number): number | undefined {
    const enrollment = this.enrollments.find(e => e.courseId === courseId);
    return enrollment ? enrollment.id : undefined;
}


  // Gestion des erreurs
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.showSnackbar(message);
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000
    });
  }
}
