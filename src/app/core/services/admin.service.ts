import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map, BehaviorSubject, forkJoin } from 'rxjs';

interface Order {
  product: {
    id: number | string;
    name: string;
    price: number;
    image?: string;
    [key: string]: any;
  };
  quantity: number;
  status?: string;
}

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile?: string;
  role: string;
  isBlock?: boolean;  // <--- Make sure this exists
  orders?: Order[];
  created_at?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3001'; // JSON Server URL
  private backendApiUrl = environment.apiUrl; // .NET Backend URL

  // BehaviorSubject to share dashboard stats updates
  private dashboardStatsSubject = new BehaviorSubject<any>(null);
  public dashboardStats$ = this.dashboardStatsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Fetch all products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  // Update a user (e.g., to update order status or block/unblock)
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  // Toggle block/unblock status and persist to JSON Server
  toggleBlockUser(user: User): Observable<User> {
    const updatedUser = { ...user, isBlock: !user.isBlock };
    return this.updateUser(user.id, updatedUser);
  }

  // Delete a user permanently
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // core/services/admin.service.ts
  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  // Fetch sales analysis data
  getSalesAnalysis(): Observable<any> {
    return this.getOrdersBackend().pipe(
      map(res => {
        const orderList = res.data || res;

        const dayMap = new Map<string, { revenue: number, sales: number }>();
        const monthMap = new Map<string, { revenue: number, sales: number }>();

        orderList.forEach((o: any) => {
          if (o.status === 'Cancelled') return;

          const date = new Date(o.createdOn);
          // Format keys
          const dayKey = date.toISOString().split('T')[0];
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

          // Calculate order totals
          const qty = o.items ? o.items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 1;
          const rev = o.totalAmount;

          if (!dayMap.has(dayKey)) dayMap.set(dayKey, { revenue: 0, sales: 0 });
          if (!monthMap.has(monthKey)) monthMap.set(monthKey, { revenue: 0, sales: 0 });

          dayMap.get(dayKey)!.revenue += rev;
          dayMap.get(dayKey)!.sales += qty;

          monthMap.get(monthKey)!.revenue += rev;
          monthMap.get(monthKey)!.sales += qty;
        });

        // Convert day maps to sorted arrays
        const dayEntries = Array.from(dayMap.entries()).sort((a, b) => a[0] < b[0] ? -1 : 1);
        const dayLabels = dayEntries.map(e => e[0]);
        const dayRevenue = dayEntries.map(e => e[1].revenue);
        const daySales = dayEntries.map(e => e[1].sales);

        // Convert month maps to sorted arrays
        const monthEntries = Array.from(monthMap.entries()).sort((a, b) => a[0] < b[0] ? -1 : 1);
        const monthLabels = monthEntries.map(e => e[0]);
        const monthRevenue = monthEntries.map(e => e[1].revenue);
        const monthSales = monthEntries.map(e => e[1].sales);

        return {
          day: { labels: dayLabels, revenue: dayRevenue, sales: daySales },
          month: { labels: monthLabels, revenue: monthRevenue, sales: monthSales }
        };
      })
    );
  }

  // Dashboard stats based on users and their orders
  getDashboardStats(): Observable<any> {
    return forkJoin({
      users: this.getUsersBackend(),
      orders: this.getOrdersBackend()
    }).pipe(
      map(({ users, orders }) => {
        // Unwrap backend response
        const userList = users.data || users;
        const orderList = orders.data || orders;

        let totalOrders = 0;
        let totalRevenue = 0;
        let pendingOrders = 0;
        let completedOrders = 0;
        let cancelledOrders = 0;

        // Sort orders by date descending
        orderList.sort((a: any, b: any) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());

        const recentOrders = orderList.slice(0, 5).map((o: any) => ({
          id: o.orderId,
          customer: o.customerName || 'Guest User',
          date: o.createdOn,
          amount: o.totalAmount,
          status: o.status
        }));

        const salesSeriesMap = new Map<string, number>();

        orderList.forEach((order: any) => {
          totalOrders += 1;

          // Only add completed/shipped/delivered/ordered orders to revenue, exclude cancelled
          if (order.status !== 'Cancelled') {
            totalRevenue += order.totalAmount;
          }

          if (order.status === 'Ordered' || order.status === 'Packed' || order.status === 'UnderProcess') {
            pendingOrders += 1;
          } else if (order.status === 'Delivered' || order.status === 'Shipped') {
            completedOrders += 1;
          } else if (order.status === 'Cancelled') {
            cancelledOrders += 1;
          }

          // Sales series by order month (using backend CreatedOn)
          const date = new Date(order.createdOn);
          const month = date.toLocaleString('default', { month: 'short' });
          const amount = order.totalAmount;

          if (order.status !== 'Cancelled') {
            const existing = salesSeriesMap.get(month) || 0;
            salesSeriesMap.set(month, existing + amount);
          }
        });

        const salesSeries = Array.from(salesSeriesMap.entries()).map(([key, value]) => ({ key, value }));
        const totalUsers = userList.length;

        const stats = { totalOrders, totalRevenue, pendingOrders, completedOrders, cancelledOrders, totalUsers, salesSeries, recentOrders };
        this.dashboardStatsSubject.next(stats); // Emit updated stats
        return stats;
      })
    );
  }

  // Method to refresh dashboard stats after updates
  refreshDashboardStats(): void {
    this.getDashboardStats().subscribe();
  }

  // --- Real Backend Endpoints for Orders ---

  getOrdersBackend(): Observable<any> {
    return this.http.get<any>(`${this.backendApiUrl}/admin/orders`);
  }

  updateOrderStatusBackend(orderId: number, status: number): Observable<any> {
    return this.http.put<any>(`${this.backendApiUrl}/admin/orders/${orderId}/status`, { status });
  }

  // --- Real Backend Endpoints for Users ---
  getUsersBackend(): Observable<any> {
    return this.http.get<any>(`${this.backendApiUrl}/admin/users`);
  }

  toggleBlockUserBackend(userId: number): Observable<any> {
    return this.http.put<any>(`${this.backendApiUrl}/admin/users/${userId}/block`, {});
  }

  deleteUserBackend(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.backendApiUrl}/admin/users/${userId}`);
  }
}
