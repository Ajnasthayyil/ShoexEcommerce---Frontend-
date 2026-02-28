import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
 
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoggedIn = false;
  cartItemCount = 0;
  wishlistItemCount = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.isLoggedIn$.subscribe((status: boolean) => {
        this.isLoggedIn = status;
      })
    );
    this.subscription.add(
      this.cartService.cartItems$.subscribe((items) => {
        this.cartItemCount = items.length;
      })
    );
    this.subscription.add(
      this.wishlistService.wishlistItems$.subscribe((items) => {
        this.wishlistItemCount = items.length;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
  this.authService.logout();
  this.cartService.reloadCart();   // Reload to clear cart after logout
  this.wishlistService.reloadWishlist();   // Reload to clear wishlist after logout
  this.toastr.success('You have logged out successfully!', 'Logout Successful');

  setTimeout(() => {
    this.router.navigate(['/home']);
  }, 1500);
}

  onWishlistClick() {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to access your wishlist!', 'Login Required', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate(['/wishlist']);
    }
  }

  onCartClick() {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to access your cart!', 'Login Required', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate(['/cart']);
    }
  }
}
