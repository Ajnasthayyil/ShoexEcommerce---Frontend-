import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
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
    private authService: AuthService,
    private toastr: ToastrService
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

          let itemsArray: any[] = [];
          if (Array.isArray(cartDto)) {
            itemsArray = cartDto;
          } else if (cartDto && Array.isArray(cartDto.items)) {
            itemsArray = cartDto.items;
          }

          if (itemsArray && itemsArray.length > 0) {
            this.cartItems = itemsArray.map((i: any) => ({
              cartItemId: i.cartItemId || i.id, // accommodate alternative properties
              product: {
                id: i.productId,
                name: i.productName || i.product?.name,
                price: i.price || i.product?.price,
                imageUrl: i.imageUrl || i.product?.imageUrl
              },
              quantity: i.quantity,
              size: i.sizeName || i.size,
              sizeId: i.sizeId
            }));
            this.cartItemsSubject.next(this.cartItems);
          } else {
            this.cartItems = [];
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
  addToCart(product: any, quantity: number = 1, size: string = '', sizeId?: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      console.log("Must be logged in to add to cart");
      return throwError(() => new Error("Not logged in"));
    }

    let finalSizeId = sizeId ? Number(sizeId) : Number(size);
    if (isNaN(finalSizeId) || finalSizeId <= 0) {
      if (product && product.sizeIds && product.sizeIds.length > 0) {
        finalSizeId = Number(product.sizeIds[0]);
      } else {
        finalSizeId = 1;
      }
    }

    const formData = new FormData();
    formData.append('ProductId', (product?.id ? product.id : 1).toString());
    formData.append('SizeId', finalSizeId.toString());
    formData.append('Quantity', (quantity ? quantity : 1).toString());

    return this.http.post<any>(`${this.apiUrl}/add`, formData).pipe(
      tap((res) => {
        if (!res.isSuccess && !!res.message) {
          this.toastr.error(res.message);
        } else {
          this.reloadCart();
          this.toastr.success('Product Successfully Added');
        }
      }),
      catchError((err) => {
        console.error("Error adding to cart", err);
        const msg = err.error?.message || err.message || 'Failed to add product to cart API.';
        this.toastr.error(msg);
        return throwError(() => err);
      })
    );
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
      next: (res) => {
        if (!res.isSuccess && !!res.message) {
          this.toastr.error(res.message);

          if (res.message.toLowerCase().includes('out of stock')) {
            // Optional: trigger a reload to get the real stock, or automatically remove if stock is 0
            this.reloadCart();
          }
        } else {
          this.reloadCart();
        }
      },
      error: (err) => {
        console.error("Error updating cart", err);
        const msg = err.error?.message || err.message || 'Error updating quantity.';
        this.toastr.error(msg);

        // If backend tells us out of stock (409) or size not available (400)
        if (msg.toLowerCase().includes('out of stock') || msg.toLowerCase().includes('size is not available')) {
          this.removeFromCart(cartItemId);
          this.toastr.warning('Item removed from cart because it is out of stock.');
        } else {
          this.reloadCart(); // revert local visual change
        }
      }
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
