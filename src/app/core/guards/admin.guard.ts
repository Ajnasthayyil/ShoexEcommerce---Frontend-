import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const isLoggedIn = !!(localStorage.getItem('loggedUser') || localStorage.getItem('loggedAdmin'));

    if (!isAdmin) {
      if (isLoggedIn) {
        // Logged in but not admin
        this.router.navigate(['/home']);
        return false;
      } else {
        // Not logged in at all
        this.router.navigate(['/auth/login']);
        return false;
      }
    }
    return true;
  }
}
