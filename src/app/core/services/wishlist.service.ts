import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Product } from '../../features/products/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/Wishlist`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.reloadWishlist();

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.reloadWishlist();
    });
  }

  /** Load wishlist items from database */
  private loadWishlistFromDB(): void {
    if (this.authService.isLoggedIn()) {
      this.http.get<any>(`${this.apiUrl}/MyWishlist`).subscribe({
        next: (res) => {
          const itemsDto = res.data || res;
          if (itemsDto && Array.isArray(itemsDto.items)) {
            const mapped = itemsDto.items.map((i: any) => ({
              id: i.productId,
              name: i.productName,
              price: i.price,
              imageUrl: i.imageUrl
            }));
            this.wishlistItemsSubject.next(mapped);
          }
        },
        error: (err) => console.log('Failed to load wishlist', err)
      });
    } else {
      this.wishlistItemsSubject.next([]);
    }
  }

  /** Get the latest wishlist array */
  getWishlistItems(): Product[] {
    return this.wishlistItemsSubject.getValue();
  }

  /** Add/Remove item to wishlist */
  toggleWishlist(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please login to use wishlist');
      return;
    }

    this.http.post<any>(`${this.apiUrl}/Toggle/${product.id}`, {}).subscribe({
      next: (res) => {
        this.reloadWishlist();
        this.toastr.success(res.message || 'Wishlist updated');
      },
      error: (err) => this.toastr.error('Failed to update wishlist')
    });
  }

  // To keep compatibility with older frontend code that used addToWishlist specifically
  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product.id)) {
      this.toggleWishlist(product);
    } else {
      this.toastr.info(`${product.name} is already in wishlist!`);
    }
  }

  /** Remove item from wishlist */
  removeFromWishlist(productId: number): void {
    if (this.isInWishlist(productId)) {
      // Find product object to toggle
      const prod = this.getWishlistItems().find(p => p.id === productId);
      if (prod) this.toggleWishlist(prod);
    }
  }

  /** Check if product is in wishlist */
  isInWishlist(productId: number): boolean {
    return this.getWishlistItems().some(p => p.id === productId);
  }

  /** Clear all items */
  clearWishlist(): void {
    if (!this.authService.isLoggedIn()) return;

    this.http.delete<any>(`${this.apiUrl}/Clear`).subscribe({
      next: () => {
        this.wishlistItemsSubject.next([]);
        this.toastr.success('Wishlist cleared');
      },
      error: (err) => this.toastr.error('Failed to clear wishlist')
    });
  }

  /** Reload wishlist */
  reloadWishlist(): void {
    this.loadWishlistFromDB();
  }
}
