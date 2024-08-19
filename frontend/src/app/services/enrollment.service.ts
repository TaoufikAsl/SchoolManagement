import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Enrollment } from '../models/enrollment.model';
import { AuthService } from './auth.service';
import { error } from 'console';


@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'https://localhost:7060/api/StudentEnrollments'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}


  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      return new HttpHeaders();
    }
  }
  

  getEnrollments(): Observable<Enrollment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Enrollment[]>(this.apiUrl, { headers }).pipe(
      tap(() => console.log('Fetching enrollments...')),
      catchError(this.handleError)
    );
  }

  enrollStudent(studentId: number, courseId: number): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    const enrollmentData = { studentId, courseId };
    return this.http.post(this.apiUrl, enrollmentData, { headers })
      .pipe(
        tap(() => console.log(`Student ${studentId} enrolled in course ${courseId}`)),
        catchError(this.handleError)
      );
  }

  

  unenrollStudent(enrollmentId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${enrollmentId}`, { headers }).pipe(
      tap(() => console.log(`Enrollment ${enrollmentId} deleted`)),
      catchError(this.handleError)
    );
  }

  getStudentCourses(userId: number): Observable<any> {
    console.log('USERIDDD',userId)
    const studentId= this.getStudentId(userId)
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/student/${studentId}/courses`, { headers }).pipe(
      tap(() => console.log(`Fetching courses for student ID: ${studentId}`)),
      catchError(this.handleError)
    );
  }
  
  getStudentId(userId:number):number{

    let idStudent=0;
    this.getStudentByUserId(userId).subscribe({
      next: (student) => {
        console.log('ETUDIANTID',student.id),
        idStudent=student.id;
      }, 
      error:(err)=>{
        console.error('etudiant id n a pas pu etre recup',err)
      }
    });
    return idStudent
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  //recuperer un student via son id
  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}/enrollments/${id}`);
  }

  getStudentByUserId(userid:number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/studentByUserId/${userid}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
}
