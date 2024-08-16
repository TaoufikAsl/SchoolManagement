import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { AuthService } from './auth.service'; // Importation du service AuthService pour obtenir le token JWT

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://localhost:7060/api/courses'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  // Crée un nouveau cours avec gestion des erreurs
  createCourse(course: Course): Observable<Course> {
    const headers = this.getAuthHeaders();
    return this.http.post<Course>(this.apiUrl, course, { headers }).pipe(
      tap(() => console.log('Creating course...')),
      catchError(this.handleError)
    );
  }

  // Met à jour un cours avec gestion des erreurs
  updateCourse(id: number, course: Course): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, course, { headers }).pipe(
      tap(() => console.log(`Updating course with ID: ${id}`)),
      catchError(this.handleError)
    );
  }

  // Supprime un cours avec gestion des erreurs
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
