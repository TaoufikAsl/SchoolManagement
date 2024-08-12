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
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthRoutingModule } from '../auth-routing.module';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';





@Component({
  selector: 'app-login',
  standalone:true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[
             MatFormFieldModule,
             FormsModule,
             CommonModule,
             MatButtonModule,
             MatInputModule,
             MatSelectModule,
             MatFormFieldModule,
             MatOptionModule, 
             MatIconModule,
             AuthRoutingModule,
             RouterOutlet,
            RouterModule,
            
        
          ],

          providers: [AuthService] 

})



export class LoginComponent {
  user: User = { username: '', password: '', role: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) {}

  login() {
    this.authService.login(this.user).subscribe({
      next: (response) => {
        console.log('User logged in:', response);
        this.router.navigate(['/courses/list']);  // Rediriger vers la liste des cours après la connexion
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your username and password.';
      }
    });
  }
}
