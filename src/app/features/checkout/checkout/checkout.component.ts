import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from 'src/app/core/services/cart.service';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/core/services/order.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class checkoutComponent implements OnInit, OnDestroy {
  totalAmount: number = 0;
  address: any = null;
  paymentMethod: string = 'Credit Card';
  cartItems: CartItem[] = [];

  private cartSubscription: Subscription = new Subscription();
  isBuyNow: boolean = false;
  buyNowProduct: any = null;

  constructor(private cartService: CartService, private router: Router,private orderService:OrdersService,private toastrService:ToastrService) {}

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  ngOnInit() {
    const buyNowData = localStorage.getItem('buyNowProduct');
    if (buyNowData) {
      this.isBuyNow = true;
      const parsedData = JSON.parse(buyNowData);
      this.buyNowProduct = parsedData.product;
      const quantity = parsedData.quantity || 1;
      this.cartItems = [{ product: this.buyNowProduct, quantity }];
      this.totalAmount = this.buyNowProduct.price * quantity;
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
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      this.address = JSON.parse(storedAddress);
    }
  }

  private updateTotal() {
    const cartItems = this.cartService.getCartItems();
    console.log('Cart items in checkout:', cartItems);
    this.totalAmount = this.cartService.getTotal();
    console.log('Total amount in checkout:', this.totalAmount);
  }



  placeOrder() {
    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    let items: CartItem[];
    if (this.isBuyNow) {
      const quantity = this.cartItems[0].quantity;
      items = [{ product: this.buyNowProduct, quantity }];
    } else {
      items = this.cartService.getCartItems();
      if (items.length === 0) {
        this.toastrService.error('Your cart is empty. Please add items to your cart before placing an order.');
        return;
      }
    }
    console.log('Placing order with items:', items);
    console.log('Order total:', this.totalAmount);
    this.orderService.saveOrder(items);
    this.toastrService.success('Order Placed Successfully');
    if (this.isBuyNow) {
      localStorage.removeItem('buyNowProduct');
    } else {
      this.cartService.clearCart();
    }
    this.router.navigate(['/orders']);
  }
}


