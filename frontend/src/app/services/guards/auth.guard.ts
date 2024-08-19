import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // Rôle attendu dans les données de la route
    const currentUser = this.authService.getLoggedInUser(); // Obtenir l'utilisateur actuel

    // Vérifier si l'utilisateur est connecté
    if (this.authService.isLoggedIn()) {
      // Si un rôle est requis pour la route
      if (expectedRole) {
        // Vérifier si l'utilisateur a le rôle attendu
        if (currentUser?.role === expectedRole) {
          return true;
        } else {
          // Si l'utilisateur n'a pas le bon rôle, rediriger vers une page d'accès refusé ou autre
          this.router.navigate(['/access-denied']); 
          return false;
        }
      }
      // Si aucun rôle n'est spécifié, autoriser l'accès
      return true;
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
