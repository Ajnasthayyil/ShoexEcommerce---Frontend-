import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesAnalyticsService {
  private base = 'http://localhost:3000';
  // subject to allow dashboard to refresh when orders change
  private refresh$ = new BehaviorSubject<void>(undefined);
  get refreshTrigger$() { return this.refresh$.asObservable(); }

  constructor(private http: HttpClient) {}

  // call this to trigger recompute (after an order was added/updated)
  notifyDataChanged() { this.refresh$.next(); }

  // load all users (each contains orders array)
  private loadUsers() {
    return this.http.get<any[]>(`${this.base}/users`);
  }

  // compute summary totals
  getTotals(): Observable<{ totalOrders:number, revenue:number, pendingOrders:number, totalUsers:number }> {
    return this.loadUsers().pipe(map(users => {
      let totalOrders=0, revenue=0, pendingOrders=0;
      users.forEach(u=>{
        if (!u.orders) return;
        u.orders.forEach((o:any)=>{
          // if order has no date or status still treat as placed
          const qty = o.quantity || 1;
          const price = (o.product && o.product.price) ? Number(o.product.price) : 0;
          totalOrders += 1;
          revenue += price * qty;
          if (!o.status || o.status === 'pending') pendingOrders += 1;
        });
      });
      return { totalOrders, revenue, pendingOrders, totalUsers: users.length };
    }));
  }

  // returns array of { key: '2025-11' or '2025-11-10', totalOrders, revenue, pendingOrders }
  getSeries(groupBy: 'day'|'month' = 'month'): Observable<any[]> {
    return this.loadUsers().pipe(map(users => {
      const map = new Map<string, { totalOrders:number, revenue:number, pendingOrders:number }>();

      users.forEach(u=>{
        (u.orders || []).forEach((o:any)=>{
          const date = o.date ? new Date(o.date) : (u.created_at ? new Date(u.created_at) : new Date());
          const dayKey = date.toISOString().split('T')[0]; // yyyy-mm-dd
          const monthKey = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`; // yyyy-mm
          const key = groupBy === 'day' ? dayKey : monthKey;

          if (!map.has(key)) map.set(key, { totalOrders:0, revenue:0, pendingOrders:0 });
          const entry = map.get(key)!;
          const qty = o.quantity || 1;
          const price = (o.product && o.product.price) ? Number(o.product.price) : 0;
          entry.totalOrders += 1;
          entry.revenue += price * qty;
          if (!o.status || o.status === 'pending') entry.pendingOrders += 1;
        });
      });

      // sort by key ascending then return array of { key, ... }
      return Array.from(map.entries())
                  .sort((a,b)=> a[0] < b[0] ? -1 : 1)
                  .map(([k,v]) => ({ key:k, ...v }));
    }));
  }
}
