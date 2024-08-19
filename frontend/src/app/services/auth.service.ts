import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import {jwtDecode} from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7060/api/auth'; // URL de l'API pour l'authentification

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
          localStorage.setItem('authToken', token); // Stocke le token JWT dans le local storage
        }
      })
    );
  }

  // Méthode pour récupérer le token JWT stocké
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Récupère le token depuis local storage
  }

  // Méthode pour vérifier si l'utilisateur est actuellement connecté
  isLoggedIn(): boolean {
    return !!this.getToken(); // Vérifie si un token existe
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('authToken'); // Supprime le token JWT du local storage
  }

  // Méthode pour décoder le token JWT et récupérer les informations de l'utilisateur
  getLoggedInUser(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Décodage du token JWT
        console.log('Token décodé:', decodedToken); // Affiche la structure du token pour vérification

        const roleClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Récupère le rôle de l'utilisateur
        const userId = decodedToken["userId"]; // Récupère l'ID de l'utilisateur

        // Affiche l'ID utilisateur pour vérification
        console.log('ID utilisateur récupéré:', userId);

        return {
          id: userId, // Assigne l'ID utilisateur
          username: decodedToken.sub || decodedToken.sub, // Nom d'utilisateur à partir du token
          role: roleClaim // Récupère et assigne le rôle de l'utilisateur
        } as User;
      } catch (error) {
        console.error('Failed to decode token', error); // Gère les erreurs de décodage
        return null;
      }
    }
    return null;
  }

  // Méthode pour récupérer l'instructorId de l'utilisateur connecté
  getInstructorId(): number | null {
    const user = this.getLoggedInUser();
    if (user && user.role === 'instructor') {
      return user.id ? +user.id : null; // Renvoie l'ID de l'instructeur si l'utilisateur est un instructeur
    }
    return null;
  }

  // Méthode pour récupérer le studentId de l'utilisateur connecté
  getStudentId(): number | null {
    const user = this.getLoggedInUser();
    if (user && user.role === 'student') {
      return user.id ? +user.id : null; // Renvoie l'ID de l'étudiant si l'utilisateur est un étudiant
    }
    return null;
  }
}
