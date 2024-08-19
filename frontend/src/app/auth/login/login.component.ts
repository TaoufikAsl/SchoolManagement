import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthRoutingModule } from '../auth-routing.module';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule, 
    MatIconModule,
    AuthRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService]
})

export class LoginComponent {
  user: User = { id:0 ,username: '', password: ''};
  errorMessage: string = '';
  openSnackBar: any;
  
  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour gérer la connexion de l'utilisateur
  login() {
    console.log('Données envoyées pour la connexion:', this.user);

    // Validation locale pour s'assurer que les champs ne sont pas vides
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    // Appel à l'API pour authentifier l'utilisateur
    this.authService.login(this.user).subscribe({
      next: (response) => {
        console.log('User logged in:', response);
        this.user.id=response.id; // Mettre à jour l'ID après la réponse du backend

        if (response && response.token) {
          // Stocker le token et d'autres informations utiles
          localStorage.setItem('token', response.token);
          localStorage.setItem('user',JSON.stringify({
            id: response.id,
            username: response.username,
            role: response.role
          }))

          // Si le rôle est renvoyé dans la réponse, il peut être stocké pour usage futur
          if (response.role) {
            localStorage.setItem('role', response.role);
          }

          console.log('Role stocké:', localStorage.getItem('role')); //Verification du rôle stocké pour test

          // Redirige l'utilisateur vers la liste des cours après la connexion
          this.router.navigate(['/courses/list']);  
        } else {
          this.errorMessage = 'Login failed. No token received.';
        }
      },
      error: (error) => {
        console.error('Login failed:', error);

        // Gestion des erreurs plus détaillée en fonction de la réponse de l'API
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (error.status === 400) {
          this.errorMessage = 'Bad request. Please check your input.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }
}
