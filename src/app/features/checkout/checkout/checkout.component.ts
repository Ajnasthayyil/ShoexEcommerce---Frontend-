import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from 'src/app/core/services/cart.service';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/core/services/order.service';
import { AddressService, AddressDto } from 'src/app/core/services/address.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/core/services/payment.service';
declare var window: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class checkoutComponent implements OnInit, OnDestroy {
  totalAmount: number = 0;

  // Address Management
  address: AddressDto | null = null;
  addresses: AddressDto[] = [];
  isLoadingAddress = false;

  paymentMethod: string = 'COD';
  cartItems: CartItem[] = [];

  private cartSubscription: Subscription = new Subscription();
  isBuyNow: boolean = false;
  buyNowProduct: any = null;
  buyNowSizeId: number | null = null;
  buyNowQuantity: number = 1;

  isPlacingOrder = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrdersService,
    private addressService: AddressService,
    private toastrService: ToastrService,
      private paymentService: PaymentService
  ) { }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  ngOnInit() {
    this.initOrderData();
    this.loadAddressData();
  }

  private initOrderData() {
    const buyNowData = localStorage.getItem('buyNowProduct');
    if (buyNowData) {
      this.isBuyNow = true;
      const parsedData = JSON.parse(buyNowData);
      this.buyNowProduct = parsedData.product;
      this.buyNowQuantity = parsedData.quantity || 1;

      this.buyNowSizeId = parsedData.sizeId !== undefined && parsedData.sizeId !== null
        ? parsedData.sizeId
        : (this.buyNowProduct.sizes && this.buyNowProduct.sizes.length > 0 ? this.buyNowProduct.sizes[0].id : 0);

      this.cartItems = [{
        product: this.buyNowProduct,
        quantity: this.buyNowQuantity,
        size: this.buyNowProduct.sizes?.find((s: any) => s.id === this.buyNowSizeId)?.name || 'N/A'
      }];
      this.totalAmount = this.buyNowProduct.price * this.buyNowQuantity;
    } else {
      const selectedItemsData = localStorage.getItem('selectedCartItems');
      if (selectedItemsData) {
        this.cartItems = JSON.parse(selectedItemsData);
        this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        localStorage.removeItem('selectedCartItems');
      } else {
        this.updateTotal();
        this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
          this.updateTotal();
        });
        this.cartService.cartItems$.subscribe(items => {
          this.cartItems = items;
        });
      }
    }
  }

  private loadAddressData() {
    this.isLoadingAddress = true;
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data || res || [];

        // 1. Try to get manually selected address from AddAddress component redirect
        const selectedIdStr = localStorage.getItem('selectedAddressId');
        if (selectedIdStr) {
          const id = parseInt(selectedIdStr, 10);
          this.address = this.addresses.find(a => a.id === id) || null;
          localStorage.removeItem('selectedAddressId'); // Consume it
        }

        // 2. If no valid selection, fallback to Default Address
        if (!this.address) {
          this.address = this.addresses.find(a => a.isDefault) || null;
        }

        // 3. Final fallback: just grab the first one if they have any but no default
        if (!this.address && this.addresses.length > 0) {
          this.address = this.addresses[0];
        }

        this.isLoadingAddress = false;
      },
      error: (err) => {
        this.toastrService.error('Failed to load your addresses.');
        this.isLoadingAddress = false;
      }
    });
  }

  private updateTotal() {
    this.totalAmount = this.cartService.getTotal();
  }

  placeOrder() {
    if (!this.paymentMethod) {
      this.toastrService.warning('Please select a payment method');
      return;
    }

    if (!this.address) {
      this.toastrService.warning('Please select or add a delivery address');
      this.router.navigate(['/checkout/add-address']);
      return;
    }

    if (this.cartItems.length === 0 && !this.isBuyNow) {
      this.toastrService.error('Your cart is empty.');
      return;
    }

    this.isPlacingOrder = true;

    if (this.isBuyNow) {
      if (!this.buyNowProduct || this.buyNowSizeId === null || this.buyNowSizeId === undefined) {
        this.toastrService.error('Invalid Buy Now data. Please try adding to cart instead.');
        this.isPlacingOrder = false;
        return;
      }

      this.orderService.placeBuyNowOrder(
        this.buyNowProduct.id,
        this.buyNowSizeId,
        this.buyNowQuantity,
        this.address.id,
        this.paymentMethod
      ).subscribe({
        next: (res) => this.handleOrderResponse(res, () => localStorage.removeItem('buyNowProduct')),
        error: (err) => this.handleErrorResponse(err)
      });
    } else {
      this.orderService.placeCartOrder(this.address.id, this.paymentMethod).subscribe({
        next: (res) => this.handleOrderResponse(res, () => this.cartService.clearCart()),
        error: (err) => this.handleErrorResponse(err)
      });
    }
  }

  private handleOrderResponse(res: any, onSuccess: () => void) {
    if (this.paymentMethod === 'COD') {
      onSuccess();
      this.handleSuccessResponse();
    } else {
      const data = res.data || res;
      this.openRazorpayModal(data, onSuccess);
    }
  }

  private async openRazorpayModal(data: any, onSuccess: () => void) {
    try {
      const loaded = await this.paymentService.loadRazorpayScript();
      if (!loaded) {
        this.toastrService.error('Failed to load Razorpay SDK. Please check your internet connection.');
        this.isPlacingOrder = false;
        return;
      }
    } catch (err) {
      this.toastrService.error('Failed to load Razorpay SDK. Please check your internet connection.');
      this.isPlacingOrder = false;
      return;
    }

    const options = {
      key: data.key,
      amount: data.amount * 100, // Razorpay works in subunits
      currency: 'INR',
      name: 'SheoxEcommerce',
      description: 'Order Payment',
      order_id: data.razorpayOrderId,
      handler: (response: any) => {
        const verifyData = {
          orderId: data.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        };

        this.paymentService.verifyPayment(verifyData).subscribe({
          next: (verifyRes) => {
            onSuccess();
            this.handleSuccessResponse();
          },
          error: (verifyErr) => {
            this.toastrService.error('Payment verification failed.');
            this.isPlacingOrder = false;
          }
        });
      },
      prefill: {
        name: this.address?.fullName || 'Customer',
        contact: this.address?.phoneNumber || ''
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          this.toastrService.warning('Payment cancelled.');
          this.isPlacingOrder = false;
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  private handleSuccessResponse() {
    this.toastrService.success('Order Placed Successfully!', 'Success');
    this.isPlacingOrder = false;
    this.router.navigate(['/orders'], { queryParams: { rateRecent: true } }); // Navigate to Purchase History
  }

  private handleErrorResponse(err: any) {
    this.toastrService.error(err.error?.message || err.error || 'Failed to place order. Please try again.', 'Error');
    this.isPlacingOrder = false;
  }
}
