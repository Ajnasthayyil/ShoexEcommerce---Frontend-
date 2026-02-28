import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/services/order.service';
import { CartItem } from 'src/app/core/services/cart.service';
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
  orders: CartItem[] = [];

  // Order steps in sequence
  orderSteps: OrderStep[] = [
    { name: 'Ordered', key: 'ordered' },
    { name: 'Packed', key: 'packed' },
    { name: 'Shipped', key: 'shipped' },
    { name: 'Delivered', key: 'delivered' },
    { name: 'cancelled', key: 'cancelled' },
  ];

  constructor(private ordersService: OrdersService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getOrders().subscribe(data => {
      this.orders = data;
    });
  }

  getStatusIndex(status?: string) {
    if (!status) return 0;
    const index = this.orderSteps.findIndex(step => step.name.toLowerCase() === status.toLowerCase());
    return index !== -1 ? index : 0;
  }

  canCancel(order: any): boolean {
    const status = order.status?.toLowerCase();
    return status !== 'delivered' && status !== 'cancelled';
  }

  cancelOrder(order: any) {
    if (this.canCancel(order)) {
      this.ordersService.cancelOrder(order);
      this.toastr.success('Order cancelled successfully!', 'Success');
      this.loadOrders(); // Reload orders to reflect changes
    }
  }

}
