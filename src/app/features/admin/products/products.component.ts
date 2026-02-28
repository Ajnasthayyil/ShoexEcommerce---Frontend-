import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/features/products/models/product.model';
import { BrandService, Brand } from 'src/app/core/services/brand.service';
import { GenderService, Gender } from 'src/app/core/services/gender.service';
import { SizeService, Size } from 'src/app/core/services/size.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  // Modals
  showAddModal = false;
  showEditModal = false;
  editProductData: Product | null = null;

  // Form
  productForm!: FormGroup;
  brands: Brand[] = [];
  genders: Gender[] = [];
  sizes: Size[] = [];
  selectedFiles: File[] = [];

  // Delete confirmation
  confirmDeleteProduct: Product | null = null;

  // Stock Management
  showStockModal = false;
  stockProductData: Product | null = null;
  stockForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private genderService: GenderService,
    private sizeService: SizeService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
    this.loadDropdownData();

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brandId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1.01)]],
      genderId: ['', Validators.required],
      description: [''],
      sizeIds: [[], Validators.required],
      primaryImageIndex: [0, Validators.required]
    });

    this.stockForm = this.fb.group({
      sizeId: ['', Validators.required],
      action: ['update', Validators.required], // 'update' or 'adjust'
      quantity: [0, [Validators.required, Validators.min(-10000)]]
    });
  }

  loadDropdownData(): void {
    this.brandService.getAll().subscribe(b => this.brands = b);
    this.genderService.getAll().subscribe(g => this.genders = g);
    this.sizeService.getAll().subscribe(s => this.sizes = s);
  }

  loadProducts(): void {
    this.productService.getAllAdmin().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.filteredProducts = [...res];
        this.applyFilters();
      },
      error: (err) => this.toastr.error('Failed to load products', 'Error')
    });
  }

  // ---------------- ADD ----------------
  openAddModal(): void {
    this.productForm.reset();
    this.productForm.patchValue({ primaryImageIndex: 0 });
    this.selectedFiles = [];
    this.showAddModal = true;
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }
    if (this.selectedFiles.length < 3) {
      this.toastr.warning('At least 3 images are required');
      return;
    }

    this.productService.create(this.productForm.value, this.selectedFiles).subscribe({
      next: () => {
        this.toastr.success('Product added successfully', 'Success');
        this.loadProducts();
        this.showAddModal = false;
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to add product', 'Error')
    });
  }

  // ---------------- EDIT ----------------
  openEditModal(product: Product): void {
    this.editProductData = product;
    this.selectedFiles = [];

    // Ensure sizeIds is an array of strings so the <select multiple> matching works accurately with DOM values
    const stringSizeIds = (product.sizeIds || []).map(id => String(id));

    this.productForm.patchValue({
      name: product.name,
      brandId: product.brandId,
      price: product.price,
      genderId: product.genderId,
      description: product.description,
      sizeIds: stringSizeIds,
      primaryImageIndex: 0 // Edit endpoint doesn't support changing primary index yet, setting 0
    });
    this.showEditModal = true;
  }

  updateProduct(): void {
    if (!this.editProductData) return;
    if (this.productForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.productService.update(this.editProductData.id, this.productForm.value).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully', 'Success');
        this.loadProducts();
        this.showEditModal = false;
        this.editProductData = null;
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to update product', 'Error')
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showStockModal = false;
    this.editProductData = null;
    this.stockProductData = null;
  }

  // ---------------- STOCK ----------------
  openStockModal(product: Product): void {
    this.stockProductData = product;
    this.stockForm.reset({ action: 'update', quantity: 0, sizeId: '' });
    this.showStockModal = true;
  }

  submitStock(): void {
    if (!this.stockProductData || this.stockForm.invalid) return;

    const { sizeId, action, quantity } = this.stockForm.value;
    const productId = this.stockProductData.id;

    if (action === 'update') {
      this.productService.updateSizeStock(productId, Number(sizeId), quantity).subscribe({
        next: () => {
          this.toastr.success('Stock updated successfully', 'Success');
          this.closeModal();
          this.loadProduct();
        },
        error: err => this.toastr.error('Failed to update stock', 'Error')
      });
    } else {
      this.productService.adjustSizeStock(productId, Number(sizeId), quantity).subscribe({
        next: () => {
          this.toastr.success('Stock adjusted successfully', 'Success');
          this.closeModal();
          this.loadProduct();
        },
        error: err => this.toastr.error('Failed to adjust stock', 'Error')
      });
    }
  }

  // ---------------- DELETE ----------------
  deleteProduct(product: Product): void {
    this.confirmDeleteProduct = product;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteProduct) return;

    this.productService.toggleActive(this.confirmDeleteProduct.id).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || 'Product status updated successfully', 'Success');
        this.loadProduct();
        this.confirmDeleteProduct = null;
      },
      error: () => this.toastr.error('Failed to update product status', 'Error')
    });
  }

  cancelDelete(): void {
    this.confirmDeleteProduct = null;
  }

  // ---------------- TOGGLE ACTIVE ----------------
  toggleActiveStatus(product: Product): void {
    this.productService.toggleActive(product.id).subscribe({
      next: (res: any) => {
        this.toastr.info(res?.message || 'Product status updated', 'Status Changed');
        this.loadProduct();
      },
      error: () => this.toastr.error('Failed to update product status', 'Error')
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }
  // --- new properties for filtering & sorting ---
  selectedCategory: string = '';
  selectedPriceRange: string = ''; // e.g. '0-499', '500-999'
  priceRanges = [
    { label: 'Under ₹500', value: '0-499' },
    { label: '₹500 - ₹999', value: '500-999' },
    { label: '₹1000 - ₹4999', value: '1000-4999' },
    { label: '₹5000 and above', value: '5000-9999999' }
  ];

  filteredProducts: Product[] = [];

  // sorting
  sortField: string = 'id'; // default sort field
  sortDir: 'asc' | 'desc' = 'asc';

  // update loadProducts to initialize filteredProducts
  loadProduct(): void {
    this.productService.getAllAdmin().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.filteredProducts = [...res];
        this.applyFilters(); // ensure initial sort/filter applied
      },
      error: (err) => this.toastr.error('Failed to load products', 'Error')
    });
  }

  // helper to parse selectedPriceRange into min/max
  private parsePriceRange(range: string): { min?: number; max?: number } {
    if (!range) return {};
    const [minStr, maxStr] = range.split('-');
    const min = Number(minStr);
    const max = Number(maxStr);
    return { min, max };
  }

  // main filter+sort application
  applyFilters(): void {
    const { min, max } = this.parsePriceRange(this.selectedPriceRange);

    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory =
        !this.selectedCategory || product.gender === this.selectedCategory;

      const matchesMinPrice = min == null || product.price >= min;
      const matchesMaxPrice = max == null || product.price <= max;

      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    // after filtering, sort the list
    this.applySort();
  }

  // sort helper toggle/caller
  sortBy(field: string): void {
    if (this.sortField === field) {
      // toggle direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applySort();
  }

  private applySort(): void {
    const field = this.sortField;
    const dir = this.sortDir === 'asc' ? 1 : -1;

    this.filteredProducts.sort((a: any, b: any) => {
      // numeric sort for price/id, string for name/brand
      const aVal = a[field];
      const bVal = b[field];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return -1 * dir;
      if (bVal == null) return 1 * dir;

      // if both numeric:
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }

      // convert to string and localeCompare (case-insensitive)
      return String(aVal).localeCompare(String(bVal), undefined, { numeric: true }) * dir;
    });
  }

  // clear filters and sorting
  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    // reset sort if you prefer; else keep sort
    this.sortField = 'id';
    this.sortDir = 'asc';
    this.filteredProducts = [...this.products];
    this.applySort();
  }


}
