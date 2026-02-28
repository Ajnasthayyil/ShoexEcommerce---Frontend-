import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getOrders(): Observable<any[]> {
    if (!this.authService.isLoggedIn()) return of([]);

    return this.http.get<any>(`${this.apiUrl}/my-orders`).pipe(
      map(res => {
        const items = res.data || res;
        return Array.isArray(items) ? items : [];
      }),
      catchError(err => {
        console.error('Failed to load orders', err);
        return of([]);
      })
    );
  }

  // Not used directly if placeOrder is now in CartService or uses /Orders/cart
  // But keeping signature for compatibility
  saveOrder(items: any[]) {
    console.log('Use placeOrder via cart checkout flow instead of saveOrder manually');
  }

  clearOrders() {
    console.log('Clear orders not supported securely on backend. Must delete individually or via admin.');
  }

  cancelOrder(order: any) {
    if (!this.authService.isLoggedIn()) return;

    const formData = new FormData();
    formData.append('OrderId', order.id?.toString() || order.orderId?.toString());
    formData.append('Reason', 'Cancelled by user');

    this.http.patch<any>(`${this.apiUrl}/cancel`, formData).subscribe({
      next: () => console.log('Order cancelled'),
      error: (err) => console.error('Failed to cancel order', err)
    });
  }
}
