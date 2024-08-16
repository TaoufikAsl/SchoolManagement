import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import {jwtDecode} from 'jwt-decode'; // Correction de l'importation

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7060/api/auth';

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer un nouvel utilisateur
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Méthode pour connecter un utilisateur
  login(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token); // Stocker le token JWT dans le local storage
        }
      })
    );
  }

  // Méthode pour récupérer le token JWT stocké
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Méthode pour vérifier si l'utilisateur est actuellement connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('authToken'); // Supprimer le token JWT du local storage
  }

  // Méthode pour décoder le token JWT et récupérer les informations de l'utilisateur
  getLoggedInUser(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Décoder le token
        return {
          id: decodedToken.sub, // ID de l'utilisateur dans "sub"
          username: decodedToken.username || decodedToken.sub, // Assurer que le nom d'utilisateur est dans le token
          role: decodedToken.role // Rôle de l'utilisateur
        } as User;
      } catch (error) {
        console.error('Failed to decode token', error);
        return null;
      }
    }
    return null;
  }

  // Méthode pour récupérer l'instructorId de l'utilisateur connecté
  getInstructorId(): number | null {
    const user = this.getLoggedInUser();
    if (user && user.role === 'instructor') {
      return user.id ? +user.id : null; // Assurez-vous de retourner l'ID en tant que nombre
    }
    return null;
  }
}
