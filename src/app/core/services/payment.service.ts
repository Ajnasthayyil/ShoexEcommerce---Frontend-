import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {}

  createOrder(amount: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/payment/create-order`,
      {
        amount: amount
      }
    );
  }

  verifyPayment(data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/payment/verify`,
      data
    );
  }

  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
}