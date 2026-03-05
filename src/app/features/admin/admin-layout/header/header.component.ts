import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit {
  showProfileMenu = false;
  adminName = '';
  adminEmail = '';
  adminRole = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Favor loggedAdmin for the admin panel header
    const profile = this.authService.getLoggedAdmin() || this.authService.getLoggedUser();
    if (profile) {
      this.adminName = profile.fullName || profile.username || 'Admin User';
      this.adminEmail = profile.email || 'admin@shoex.com';
      this.adminRole = profile.role || (profile.roleId === 1 ? 'Administrator' : 'Admin');
    } else {
      // Final fallback if no profile is found (though guards should prevent this)
      this.adminName = 'Admin';
      this.adminEmail = 'admin@shoex.com';
      this.adminRole = 'Administrator';
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
