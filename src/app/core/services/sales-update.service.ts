import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SalesAnalyticsService } from './sales-analytics.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesUpdateService {
  private base = 'http://localhost:3001';
  constructor(private http: HttpClient, private analytics: SalesAnalyticsService) {}

  // append order to user by id, saves back to users/:id
  addOrderToUser(userId: string, order: any): Observable<any> {
    // first fetch user
    return this.http.get<any>(`${this.base}/users/${userId}`).pipe(
      switchMap(user => {
        user.orders = user.orders || [];
        // enrich order: ensure date and status
        order.date = order.date || (new Date()).toISOString().split('T')[0];
        order.status = order.status || 'pending';
        user.orders.push(order);
        // update user
        return this.http.put(`${this.base}/users/${userId}`, user).pipe(
          map(res=>{
            // notify analytics to refresh
            this.analytics.notifyDataChanged();
            return res;
          })
        );
      })
    );
  }

  // when order delivered or status changed: update specific order entry for a user
  updateOrderStatus(userId: string, orderIndex: number, status: string): Observable<any> {
    return this.http.get<any>(`${this.base}/users/${userId}`).pipe(
      switchMap(user => {
        if (!user.orders || !user.orders[orderIndex]) return of(user);
        user.orders[orderIndex].status = status;
        return this.http.put(`${this.base}/users/${userId}`, user).pipe(
          map(res=>{ this.analytics.notifyDataChanged(); return res; })
        );
      })
    );
  }
}
