import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NewCourse } from '../models/courses/new-course';
import { AuthService } from './auth.service'; // Importation du service AuthService pour obtenir le token JWT
import { Course } from '../models/courses/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://localhost:7060/api/courses'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Méthode pour obtenir les en-têtes d'autorisation
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Récupère le token JWT depuis le localStorage via AuthService
    console.log('Token:', token); // Debug: vérifier si le token est récupéré

    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      return new HttpHeaders();
    }
  }

  // Récupère la liste des cours avec gestion des erreurs
  getCourses(): Observable<Course[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Course[]>(this.apiUrl, { headers }).pipe(
      tap(() => console.log('Fetching courses...')),
      catchError(this.handleError)
    );
  }

  // Récupère un cours par son ID
  getCourseById(id: number): Observable<Course> {
    const headers = this.getAuthHeaders();
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => console.log(`Fetching course with ID: ${id}`)),
      catchError(this.handleError)
    );
  }

  // Crée un nouveau cours avec gestion des erreurs
  createCourse(course: NewCourse): Observable<Course> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post<Course>(this.apiUrl, course, { headers }).pipe(
      tap((response) => console.log('Course created:', response)),
      catchError(this.handleError)
    );
  }
  getEnrolledCourses(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`https://localhost:7060/api/StudentEnrollments/student/${studentId}/courses`);
  }


  // Met à jour un cours existant
  updateCourse(id: number, course: Course): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.apiUrl}/${id}`, course, { headers }).pipe(
      tap(() => console.log(`Updating course with ID: ${id}`)),
      catchError(this.handleError)
    );
  }

  // Supprime un cours
  deleteCourse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => console.log(`Deleting course with ID: ${id}`)),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs globales
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage); // Log pour debug
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
