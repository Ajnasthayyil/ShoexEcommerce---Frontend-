import { Component, OnInit } from '@angular/core';
import { PRODUCTS } from '../../features/products/data/product-data';
import { Product } from '../../features/products/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.products = PRODUCTS;
  }

  viewDetails(id: number) {
    this.router.navigate(['/products', id]);
  }
}
