import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getLoggedUser() || this.authService.getLoggedAdmin();
  }
   goToAddToCart() {
    this.router.navigate(['/cart']);
  }
   goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);  
  }
}

