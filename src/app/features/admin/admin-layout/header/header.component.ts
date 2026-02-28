import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
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
    const user = this.authService.getLoggedUser();
    if (user && this.authService.getLoggedAdmin()) {
      this.adminName = user.fullName || user.username || 'Admin';
      this.adminEmail = user.email || '';
      this.adminRole = user.role === 'admin' ? 'Administrator' : user.role;
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
