import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';  // Assure-toi d'avoir un modèle User
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7060/api/users'; // API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Méthode pour obtenir les en-têtes d'autorisation
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  // Récupérer la liste des utilisateurs
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un nouvel utilisateur
  createUser(user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.post<User>(this.apiUrl, user, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs globales
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
