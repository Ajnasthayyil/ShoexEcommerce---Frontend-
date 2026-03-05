import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/services/order.service';
import { ToastrService } from 'ngx-toastr';

interface OrderStep {
  name: string;
  key: string;
}

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html'
})
export class userOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;

  // Order steps in sequence
  orderSteps: OrderStep[] = [
    { name: 'Ordered', key: 'ordered' },
    { name: 'Under Process', key: 'underprocess' },
    { name: 'Packed', key: 'packed' },
    { name: 'Shipped', key: 'shipped' },
    { name: 'Delivered', key: 'delivered' },
    { name: 'Cancelled', key: 'cancelled' },
  ];

  constructor(private ordersService: OrdersService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load orders', 'Error');
        this.isLoading = false;
      }
    });
  }

  getStatusIndex(status?: string) {
    if (!status) return 0;

    let normalizedStatus = status.toLowerCase().replace(/\s+/g, '');

    // Mapping legacy or alternative statuses from backend
    if (normalizedStatus === 'pending' || normalizedStatus === 'placed') {
      normalizedStatus = 'ordered';
    } else if (normalizedStatus === 'processing') {
      normalizedStatus = 'underprocess';
    }

    const index = this.orderSteps.findIndex(step => step.key.toLowerCase() === normalizedStatus);
    return index !== -1 ? index : 0;
  }

  orderToCancel: any = null;

  canCancel(order: any): boolean {
    const status = order.status?.toLowerCase();
    // Cannot cancel if it is past under process
    return status !== 'packed' && status !== 'shipped' && status !== 'delivered' && status !== 'cancelled';
  }

  cancelOrder(order: any) {
    if (this.canCancel(order)) {
      this.orderToCancel = order;
    }
  }

  closeCancelModal() {
    this.orderToCancel = null;
  }

  confirmCancel() {
    if (this.orderToCancel) {
      const order = this.orderToCancel;
      this.closeCancelModal();

      this.ordersService.cancelOrder(order).subscribe({
        next: () => {
          this.toastr.success(`Order #${order.orderId} cancelled successfully!`, 'Success');
          this.loadOrders(); // Reload orders to reflect changes
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.error || 'Failed to cancel order. Please try again.';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

}
