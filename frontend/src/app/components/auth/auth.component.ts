import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  user: User = { username: '', password: '', role: '' };

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.user).subscribe(response => {
      console.log('User registered:', response);
    });
  }

  login() {
    this.authService.login(this.user).subscribe(response => {
      console.log('User logged in:', response);
    });
  }
}
