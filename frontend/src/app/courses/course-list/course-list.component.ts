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
  studentId =0;
  


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
  async loadEnrolledCourses(): Promise<void> {

    try { console.log('loadenrollcourse');
      const user = this.authService.getLoggedInUser();
      if (user && user.id) {
        // Récupérer l'ID de l'étudiant en attendant la résolution de la promesse
         await this.enrollmentService.getStudentId(user.id).then(res=>{
          this.studentId=res,
          console.log('RESSSSSSSS',res)},
          );
        console.log('studentIdUser', this.studentId);
        console.log('studentIdUserType', typeof(this.studentId));

        // Récupérer les cours de l'étudiant en attendant la résolution de la promesse
        await this.enrollmentService.getStudentCourses(this.studentId).subscribe({
        next:(response: Course[])=>{

        // Mettre à jour la liste des cours inscrits
        this.enrolledCourses = response;
        console.log('GetStudentCourse',response);
      }})} else {
        console.error('Utilisateur non connecté ou ID invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des cours inscrits', error);
    }
    console.log('exit')
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

  async enrollStudent(courseId: number): Promise<void> {
    try {
      console.log('enrollStudent');
      // Attendre la récupération de l'ID de l'étudiant
      const studentId = await this.enrollmentService.getStudentId(this.userId);
  
      // Vérifiez si l'ID de l'étudiant est valide
      if (!studentId) {
        this.showSnackbar('Erreur : impossible d\'identifier l\'étudiant');
        return;
      }
  
      console.log('COURS ID', courseId);
  
      // Inscrire l'étudiant au cours
      await this.enrollmentService.enrollStudent(studentId, courseId).toPromise();
      
      // Afficher le message de succès
      this.showSnackbar('Inscription réussie');
      
      // Recharger les cours inscrits
      this.loadEnrolledCourses();
    } catch (error) {
      // Gérer les erreurs
      this.handleError('Erreur lors de l\'inscription', error);
    }
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
