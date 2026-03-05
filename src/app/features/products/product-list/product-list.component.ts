import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { SizeService, Size } from 'src/app/core/services/size.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  genders: string[] = ['Men', 'Women'];
  selectedGender: string = '';
  selectedPriceRange: string = '';
  searchQuery: string = '';
  wishlistIds: Set<number> = new Set();
  isAddingToCart: boolean = false;
  sizesLookup: Map<number, string> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private sizeService: SizeService
  ) { }

  ngOnInit(): void {
    // First fetch sizes dictionary so we can map them when product loads
    this.sizeService.getAll().subscribe({
      next: (sizes) => {
        sizes.forEach((s: Size) => this.sizesLookup.set(Number(s.id), s.name));
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to load sizes', err);
        this.loadProducts(); // load anyway just in case
      }
    });

    // Subscribe to wishlist changes for reactive UI updates
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistIds = new Set(items.map(p => p.id));
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;

      // Map numeric size IDs to physical text sizes for all loaded products
      this.products.forEach(product => {
        if (product.sizeIds) {
          product.mappedSizes = product.sizeIds.map(sizeId => {
            const numId = Number(sizeId);
            return {
              id: numId,
              name: this.sizesLookup.get(numId) || numId.toString()
            };
          }).sort((a, b) => a.id - b.id);
        }
      });

      this.filteredProducts = [...this.products];
      this.route.queryParams.subscribe(params => {
        this.searchQuery = params['search']?.toLowerCase() || '';
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      let genderMatch = true;
      if (this.selectedGender) {
        const productGender = (product.gender || '').toLowerCase();
        const selected = this.selectedGender.toLowerCase();

        // Handle alias matching (Men -> Male, Women -> Female)
        if (selected === 'men') {
          genderMatch = productGender === 'men' || productGender === 'male';
        } else if (selected === 'women') {
          genderMatch = productGender === 'women' || productGender === 'female';
        } else {
          genderMatch = productGender === selected;
        }
      }

      let priceMatch = true;
      switch (this.selectedPriceRange) {
        case '1000-2999':
          priceMatch = product.price >= 1000 && product.price <= 2999;
          break;
        case '3000-5999':
          priceMatch = product.price >= 3000 && product.price <= 5999;
          break;
        case 'above5999':
          priceMatch = product.price > 5999;
          break;
      }

      const searchMatch = this.searchQuery
        ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      return genderMatch && priceMatch && searchMatch;
    });
    this.currentPage = 1; // Reset to first page on filter change
  }

  filterProducts() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedGender = '';
    this.selectedPriceRange = '';
    this.searchQuery = '';
    this.filteredProducts = [...this.products];
    this.currentPage = 1; // Reset to first page on clear filters
  }

  //  Added Methods Below

  viewDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  toggleWishlist(item: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('User not logged in');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.wishlistService.isInWishlist(item.id)) {
      this.wishlistService.removeFromWishlist(item.id);
    } else {
      this.wishlistService.addToWishlist(item);
    }
  }

  isInWishlist(item: Product): boolean {
    return this.wishlistIds.has(item.id);
  }

  // pagination for product list

  currentPage: number = 1;
  itemsPerPage: number = 8; // show 8 per page

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
  }
}
