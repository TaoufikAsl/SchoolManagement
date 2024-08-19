import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports:[
    CommonModule,
    FormsModule
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser?: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Charger les utilisateurs depuis le service
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  // Sélectionner un utilisateur pour édition
  editUser(user: User): void {
    this.selectedUser = { ...user }; // Cloner l'utilisateur sélectionné
    console.log('Editing user:', this.selectedUser);
  }

  // Mettre à jour l'utilisateur sélectionné
  updateUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => {
          this.loadUsers(); // Recharger la liste des utilisateurs
          this.selectedUser = undefined; // Désélectionner l'utilisateur
          console.log('User updated successfully');
        },
        error: (err) => {
          console.error('Failed to update user', err);
        }
      });
    }
  }

  // Annuler l'édition et réinitialiser le formulaire
  cancelEdit(): void {
    this.selectedUser = undefined;
  }
}
