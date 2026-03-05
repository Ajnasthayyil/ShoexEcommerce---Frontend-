import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/core/services/product.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';

import { SizeService, Size } from 'src/app/core/services/size.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  mainImage: string = '';
  sizesLookup: Map<number, string> = new Map();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private sizeService: SizeService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  private loadProduct(id: number) {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.mainImage = product.imageUrl;

        // Use sizes from product if available (populated by backend now)
        if (this.product.sizes && this.product.sizes.length > 0) {
          this.product.mappedSizes = this.product.sizes.map(s => ({
            id: s.id,
            name: s.name
          }));
        } else if (this.product.sizeIds) {
          // Fallback to sizeIds if sizes list is missing (legacy/other APIs)
          this.product.mappedSizes = this.product.sizeIds.map(sizeId => {
            const numId = Number(sizeId);
            return {
              id: numId,
              name: this.sizesLookup.get(numId) || numId.toString()
            };
          });
        } else {
          this.product.mappedSizes = [];
        }
      },
      error: (err) => console.error(err)
    });
  }
  isOutOfStock: boolean = false;

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.toastrService.warning('User not logged in');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.selectedSizeId) {
      this.toastrService.warning('Please select a size before adding to cart.');
      return;
    }
    this.cartService.addToCart(this.product, this.quantity, '', this.selectedSizeId).subscribe({
      next: () => {
        this.isOutOfStock = false;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || '';
        if (msg.toLowerCase().includes('out of stock') || msg.toLowerCase().includes('not available')) {
          this.isOutOfStock = true;
        }
      }
    });
  }

  buyNow() {
    if (!this.authService.isLoggedIn()) {
      this.toastrService.warning('User not logged in');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.selectedSizeId) {
      this.toastrService.warning('Please select a size before proceeding to buy.');
      return;
    }
    if (this.isOutOfStock) {
      this.toastrService.warning('This product size is currently out of stock.');
      return;
    }

    // Verify quantity vs actual size stock before proceeding to local checkout
    if (this.product && this.product.sizeStocks) {
      const stock = this.product.sizeStocks[this.selectedSizeId];
      if (stock !== undefined && this.quantity > stock) {
        this.toastrService.warning(`Only ${stock} items available in this size.`);
        return;
      }
    }

    const buyNowData = { product: this.product, quantity: this.quantity, sizeId: this.selectedSizeId };
    localStorage.setItem('buyNowProduct', JSON.stringify(buyNowData));
    this.router.navigate(['checkout/add-address']);
  }

  quantity: number = 1;
  selectedSizeId: number | null = null;

  changeMainImage(url: string) {
    this.mainImage = url;
  }

  incrementQuantity() {
    if (!this.selectedSizeId) {
      this.toastrService.warning('Please select a size first.');
      return;
    }

    if (this.product && this.product.sizeStocks) {
      const stock = this.product.sizeStocks[this.selectedSizeId];
      if (stock !== undefined && this.quantity >= stock) {
        this.toastrService.warning(`Only ${stock} items available in this size.`);
        return;
      }
    }

    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectSize(sizeId: number) {
    this.selectedSizeId = sizeId;

    // Check local stock from payload
    if (this.product && this.product.sizeStocks) {
      const stock = this.product.sizeStocks[sizeId];
      if (stock === 0) {
        this.isOutOfStock = true;
      } else {
        this.isOutOfStock = false;
      }
    } else {
      this.isOutOfStock = false; // fallback
    }
  }

  // WISHLIST LOGIC
  toggleWishlist() {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.toastrService.warning('User not logged in');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.isInWishlist(this.product.id);
  }
}
