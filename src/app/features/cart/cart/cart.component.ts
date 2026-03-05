import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/core/services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  selectedItems: Set<number> = new Set();

  constructor(private cartService: CartService, private router: Router, private toastService: ToastrService) { }

  ngOnInit() {
    // Add test product properly
    // const testProduct = {
    //   id: 123,
    //   name: 'Test Product',
    //   price: 1000,
    //   imageUrl: 'https://via.placeholder.com/150',
    //   availableSizes: ['S', 'M'],
    //   gender: 'Unisex',
    //   description: 'This is a test product added for debugging.'
    // };

    // // ✅ Pass product inside addToCart correctly
    // this.cartService.addToCart(testProduct,1);

    // ✅ Single subscription is enough
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      // Auto-select all items by default if none are selected yet
      if (this.selectedItems.size === 0 && items.length > 0) {
        items.forEach(item => this.selectedItems.add(item.product.id));
      }
      console.log('Cart items now:', this.cartItems);
    });
  }


  removeItem(item: CartItem) {
    if (item.cartItemId) {
      this.cartService.removeFromCart(item.cartItemId);
      this.selectedItems.delete(item.product.id);
      this.toastService.success('Product successfully removed from cart');
    } else {
      this.toastService.error('Error removing item: Invalid cart item id');
    }
  }



  toggleSelection(id: number) {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedItems.has(id);
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  getSelectedTotal() {
    return this.cartItems
      .filter(item => this.isSelected(item.product.id))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  incrementQuantity(item: CartItem) {
    if (item.cartItemId) {
      this.cartService.updateQuantity(item.cartItemId, item.quantity + 1);
    }
  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1 && item.cartItemId) {
      this.cartService.updateQuantity(item.cartItemId, item.quantity - 1);
    }
  }

  updateSize(item: CartItem, event: Event) {
    // Currently, CartService does not natively support changing just the size.
    // If we wanted to change size we'd likely need a new backend endpoint
    // or to remove the item and add a new one. For now, notifying user.
    this.toastService.warning('Updating size directly is currently unsupported');
  }

  goToAddress() {
    if (this.selectedItems.size === 0) {
      this.toastService.error('Please select items to proceed');
      return;
    }
    const selectedCartItems = this.cartItems.filter(item => this.selectedItems.has(item.product.id));
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems));
    this.router.navigate(['checkout/add-address']);
  }
}

