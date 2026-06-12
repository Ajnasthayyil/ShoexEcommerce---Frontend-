import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/services/order.service';
import { ReviewService } from 'src/app/core/services/review.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private ordersService: OrdersService, 
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data || res;
        this.isLoading = false;

        // Auto open review if redirected from checkout success
        this.route.queryParams.subscribe(params => {
          if (params['rateRecent'] && this.orders.length > 0) {
            const recentOrder = this.orders[0];
            if (recentOrder.items && recentOrder.items.length > 0 && recentOrder.status?.toLowerCase() !== 'cancelled') {
              const itemToReview = recentOrder.items[0];
              this.openReviewModal(itemToReview);

              // Clear query parameters from URL
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { rateRecent: null },
                queryParamsHandling: 'merge'
              });
            }
          }
        });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Failed to load orders';
        this.toastr.error(msg, 'Error');
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

  // Review System
  reviewModalOpen = false;
  selectedProductForReview: any = null;
  ratingValue = 0;
  reviewText = '';

  openReviewModal(item: any) {
    this.selectedProductForReview = item;
    this.ratingValue = 0;
    this.reviewText = '';
    this.reviewModalOpen = true;
  }

  closeReviewModal() {
    this.reviewModalOpen = false;
    this.selectedProductForReview = null;
  }

  setRating(stars: number) {
    this.ratingValue = stars;
  }

  submitReview() {
    if (!this.selectedProductForReview || this.ratingValue === 0) return;

    this.reviewService.addReview({
      productId: this.selectedProductForReview.productId,
      rating: this.ratingValue,
      reviewText: this.reviewText
    }).subscribe({
      next: (res) => {
        this.toastr.success('Review submitted successfully!', 'Thank you!');
        this.closeReviewModal();
        this.loadOrders(); // Optional: Reload to update UI if we want to hide the button
      },
      error: (err) => {
        console.error('Review submission error:', err);
        // ErrorInterceptor converts HttpErrorResponse to Error object,
        // so err.message holds the actual backend message
        const msg = err?.message || err?.error?.message || 'Failed to submit review.';
        this.toastr.error(msg, 'Error');
      }
    });
  }

}
