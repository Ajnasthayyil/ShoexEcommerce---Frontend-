import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface CartItem {
  cartItemId?: number;
  product: any;
  quantity: number;
  size?: string;
  sizeId?: number;
  status?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/Cart`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.reloadCart();

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.reloadCart();
    });
  }

  // Load cart items from database or local storage (if guest support desired, but for now we focus on logged in)
  private loadCartFromDB(): void {
    if (this.authService.isLoggedIn()) {
      this.http.get<any>(`${this.apiUrl}/myCart`).subscribe({
        next: (res) => {
          const cartDto = res.data || res;
          if (cartDto && cartDto.items) {
            this.cartItems = cartDto.items.map((i: any) => ({
              cartItemId: i.cartItemId,
              product: {
                id: i.productId,
                name: i.productName,
                price: i.price,
                imageUrl: i.imageUrl
              },
              quantity: i.quantity,
              size: i.sizeName,
              sizeId: i.sizeId
            }));
            this.cartItemsSubject.next(this.cartItems);
          }
        },
        error: (err) => console.log('Failed to load cart', err)
      });
    } else {
      this.cartItems = [];
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  // Reload cart from DB
  reloadCart() {
    this.loadCartFromDB();
  }

  // Add item to cart
  addToCart(product: any, quantity: number = 1, size: string = '', sizeId?: number) {
    if (!this.authService.isLoggedIn()) {
      // Could implement local storage cart here, or prompt login
      console.log("Must be logged in to add to cart");
      return;
    }

    const formData = new FormData();
    formData.append('ProductId', product.id.toString());
    // Use the provided size id or a fallback
    formData.append('SizeId', sizeId ? sizeId.toString() : '1');
    formData.append('Quantity', quantity.toString());

    this.http.post<any>(`${this.apiUrl}/add`, formData).subscribe({
      next: () => this.reloadCart(),
      error: (err) => console.error("Error adding to cart", err)
    });
  }

  // Remove item from cart
  removeFromCart(cartItemId: number) {
    if (!this.authService.isLoggedIn()) return;

    this.http.delete<any>(`${this.apiUrl}/delete/${cartItemId}`).subscribe({
      next: () => this.reloadCart(),
      error: (err) => console.error("Error removing from cart", err)
    });
  }

  // Get all cart items
  getCartItems() {
    return this.cartItems;
  }

  // Get total cart amount
  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    if (!this.authService.isLoggedIn()) {
      this.cartItems = [];
      this.cartItemsSubject.next(this.cartItems);
      return;
    }

    this.http.delete<any>(`${this.apiUrl}/clear`).subscribe({
      next: () => {
        this.cartItems = [];
        this.cartItemsSubject.next(this.cartItems);
      },
      error: (err) => console.error("Error clearing cart", err)
    });
  }

  // Remove multiple items from cart (not natively supported by backend clear or single delete, doing a loop or just clear if all)
  removeMultipleFromCart(cartItemIds: number[]) {
    // For simplicity, we could loop or implement a new backend endpoint
    cartItemIds.forEach(id => this.removeFromCart(id));
  }

  // Update quantity of a cart item
  updateQuantity(cartItemId: number, quantity: number) {
    if (!this.authService.isLoggedIn()) return;

    const formData = new FormData();
    formData.append('CartItemId', cartItemId.toString());
    formData.append('Quantity', quantity.toString());

    this.http.put<any>(`${this.apiUrl}/update`, formData).subscribe({
      next: () => this.reloadCart(),
      error: (err) => console.error("Error updating cart", err)
    });
  }

  // Place an order (delegated to OrderService or handled via /Orders/cart backend endpoint)
  // Re-routing this logic heavily.
  placeOrder(addressId?: number, paymentMethod: string = 'COD') {
    // Usually better in an OrderService, returning observable if needed
    const formData = new FormData();
    if (addressId) formData.append('AddressId', addressId.toString());
    formData.append('PaymentMethod', paymentMethod);

    return this.http.post<any>(`${environment.apiUrl}/Orders/cart`, formData).pipe(
      tap(() => {
        this.clearCart(); // Local clear
      })
    );
  }
}
