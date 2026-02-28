import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(private route: ActivatedRoute,
    private router:Router,
    private cartService:CartService,
    private authService: AuthService,
    private toastrService:ToastrService,
    private productService: ProductService ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
  next: (product) => {
    this.product = product; // assign the product
  },
  error: (err) => console.error(err)
});

  }
  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.toastrService.warning('User not logged in');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.selectedSize) {
      this.toastrService.warning('Please select a size before adding to cart.');
      return;
    }
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    this.toastrService.success('Product Successfully Added');
  }
buyNow() {
  if (!this.authService.isLoggedIn()) {
    this.toastrService.warning('User not logged in');
    this.router.navigate(['/auth/login']);
    return;
  }
  if (!this.selectedSize) {
    this.toastrService.warning('Please select a size before proceeding to buy.');
    return;
  }
  const buyNowData = { product: this.product, quantity: this.quantity, size: this.selectedSize };
  localStorage.setItem('buyNowProduct', JSON.stringify(buyNowData));
  this.router.navigate(['checkout/add-address']);
}

  quantity: number = 1;
  selectedSize: string = '';

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }
}
