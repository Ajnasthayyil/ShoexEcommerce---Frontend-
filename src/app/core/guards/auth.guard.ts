import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';

      // Allowing admins to access user routes if they choose to
      // (Used to redirect here, but it caused issues with wishlist access)

      const loggedUser = this.authService.getLoggedUser();
      if (loggedUser && (loggedUser.isBlocked || loggedUser.isBlock)) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}

