import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../products/models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist: Product[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.wishlistService.wishlistItems$.subscribe((items) => {
        this.wishlist = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeFromWishlist(item: Product) {
    this.wishlistService.removeFromWishlist(item.id);
  }

  moveToCart(item: Product) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.cartService.addToCart(item).subscribe({
      next: () => {
        this.wishlistService.removeFromWishlist(item.id);
      }
    });
  }

  viewProduct(item: Product) {
    this.router.navigate(['/products', item.id]);
  }
}
