import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Enrollment } from '../models/enrollment.model';
import { Student } from '../models/courses/student.model';
import { AuthService } from './auth.service';
import { error } from 'console';
import { resolve } from 'path';
import { rejects } from 'assert';


@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'https://localhost:7060/api/StudentEnrollments'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const enrollmentData = { studentId, courseId };
    return this.http.post(this.apiUrl, enrollmentData, { headers }).pipe(
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
    const studentId= this.getStudentId(userId).then(res =>console.log('getstudentcourse',res))
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/student/${studentId}/courses`, { headers }).pipe(
      tap(() => console.log(`Fetching courses for student ID: ${studentId}`)),
      catchError(this.handleError)
    );
  }
  
   getStudentId(userId: number): Promise<number> {
    
    return new Promise((resolve, reject) => {
       this.getStudentByUserId(userId).subscribe({
        next:(student: Student)=>{
          console.log('ETUDIANTID', student.id);
          resolve(student.id); // Resolve with a number
        },
        error:(err)=>{
          console.error(err),
          reject('l etudiant n a pas pu etre recup par user')
        }
      });
    });
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

  getStudentByUserId(userid:number): Observable<Student> {
    const headers = this.getAuthHeaders();
    return this.http.get<Student>(`${this.apiUrl}/studentByUserId/${userid}`, { headers })
    ;
  }
  
}
