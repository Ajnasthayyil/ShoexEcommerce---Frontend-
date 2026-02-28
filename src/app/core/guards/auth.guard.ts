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

      // Prevent Admins from accessing User-only routes (like Cart, Checkout)
      if (isAdmin) {
        this.router.navigate(['/admin/dashboard']);
        return false;
      }

      const loggedUser = this.authService.getLoggedUser();
      if (loggedUser && loggedUser.isBlock) {
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

