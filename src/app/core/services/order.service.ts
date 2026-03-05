import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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

  placeCartOrder(addressId: number, paymentMethod: string): Observable<any> {
    if (!this.authService.isLoggedIn()) return throwError(() => new Error('User is not logged in'));

    const formData = new FormData();
    formData.append('AddressId', addressId.toString());
    formData.append('PaymentMethod', paymentMethod);

    return this.http.post<any>(`${this.apiUrl}/cart`, formData);
  }

  placeBuyNowOrder(productId: number, sizeId: number, quantity: number, addressId: number, paymentMethod: string): Observable<any> {
    if (!this.authService.isLoggedIn()) return throwError(() => new Error('User is not logged in'));

    const formData = new FormData();
    formData.append('ProductId', productId.toString());
    formData.append('SizeId', sizeId.toString());
    formData.append('Quantity', quantity.toString());
    formData.append('AddressId', addressId.toString());
    formData.append('PaymentMethod', paymentMethod);

    return this.http.post<any>(`${this.apiUrl}/buy-now`, formData);
  }

  cancelOrder(order: any): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User is not logged in'));
    }

    const formData = new FormData();
    formData.append('OrderId', order.orderId?.toString() || order.id?.toString());
    formData.append('Reason', 'Cancelled by user');

    return this.http.patch<any>(`${this.apiUrl}/cancel`, formData);
  }
}
