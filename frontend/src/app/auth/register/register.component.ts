import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = { username: '', password: '', role: 'student' }; // Par défaut, enregistrer les utilisateurs comme étudiants
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.router.navigate(['/auth/login']);  // Rediriger vers la page de connexion après l'enregistrement
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}
