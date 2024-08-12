import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-register',
  standalone:true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports:[
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatIconModule
  ]
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
