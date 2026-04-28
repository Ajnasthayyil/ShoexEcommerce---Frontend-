# 🛍️ Shoex Ecommerce Frontend

> A modern, responsive **Angular** ecommerce storefront for an online shoe store. Features a beautiful UI with Angular Material, Tailwind CSS, and seamless integration with the Shoex REST API. Optimized for performance, accessibility, and user experience.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Angular%20Material-0078D4?style=for-the-badge&logo=material-design&logoColor=white" alt="Angular Material"/>
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS"/>
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm"/>
</p>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Services & State Management](#services--state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 🎯 Overview

Shoex Frontend is a full-featured ecommerce web application built with **Angular 15+**. It provides customers with a seamless shopping experience including:

- 🏪 **Product Browsing** — Search, filter, and discover shoes
- 🛒 **Shopping Cart** — Add/remove items, manage quantities
- 💳 **Checkout & Payment** — Secure payment processing
- 👤 **User Accounts** — Registration, login, profile management
- 📦 **Order Tracking** — Monitor order status in real-time
- ⭐ **Reviews & Ratings** — Leave feedback on products
- 🔍 **Search & Filtering** — Find products by category, price, rating
- 📱 **Responsive Design** — Works seamlessly on mobile, tablet, desktop
- ♿ **Accessibility** — WCAG 2.1 compliant

---

## 🛠 Tech Stack

### Frontend Framework & Languages
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Angular** | Frontend framework | 15+ |
| **TypeScript** | Programming language | 4.8+ |
| **RxJS** | Reactive programming | 7+ |
| **Node.js** | Runtime environment | 16+ |
| **npm** | Package manager | 8+ |

### UI & Styling
| Library | Purpose |
|---------|---------|
| **Angular Material** | Pre-built UI components |
| **Tailwind CSS** | Utility-first CSS framework |
| **Angular Material Icons** | Icon library |

### API & Communication
| Library | Purpose |
|---------|---------|
| **HttpClientModule** | HTTP requests |
| **Interceptors** | JWT token handling, error management |
| **Services** | API integration |

### State Management & Forms
| Library | Purpose |
|---------|---------|
| **RxJS** | Observable-based state management |
| **FormControl & FormBuilder** | Form handling |
| **BehaviorSubject** | Shared state across components |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Angular CLI** | Development server & build tools |
| **Webpack** | Module bundler |
| **Karma & Jasmine** | Unit testing |
| **ESLint** | Code quality |

---

## ✨ Core Features

### 🏪 Product Catalog
- Browse all products with image galleries
- Filter by category, price range, size, color
- Sort by price, popularity, newest, rating
- Product search with autocomplete
- Detailed product pages with specifications
- Customer reviews and ratings
- Stock availability indicators

### 🛒 Shopping Cart
- Add/remove products from cart
- Update product quantities
- Real-time cart summary
- Persistent cart (stored in localStorage)
- Cart calculation with discounts
- Recommended products section

### 💳 Checkout & Payment
- Multi-step checkout process
- Shipping address form
- Billing address options
- Multiple payment methods
- Order review before confirmation
- Payment confirmation with receipt
- Invoice download

### 👤 User Account Management
- User registration with validation
- Secure login/logout
- Profile management (edit details)
- Address book management
- Wishlist functionality
- Order history viewing
- Account settings

### 📦 Order Management
- View all orders
- Order status tracking
- Order details with items
- Cancel order (if eligible)
- Download invoice as PDF
- Order timeline/history

### ⭐ Reviews & Ratings
- Leave product reviews with ratings
- View customer reviews on product page
- Filter reviews (newest, highest-rated)
- Review moderation (admin approval)
- Helpful/unhelpful voting

### 🔍 Search & Discovery
- Global search with suggestions
- Advanced filtering (category, price, size)
- Sort options (price, rating, newest)
- Related products recommendations
- Trending/featured products section
- Recently viewed products

### 📱 Responsive Design
- Mobile-first approach
- Tablet & desktop optimization
- Touch-friendly interface
- Hamburger menu on mobile
- Responsive grid layouts
- Mobile payment integration

### ♿ Accessibility
- WCAG 2.1 Level AA compliant
- Semantic HTML
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management

---

## 📸 Screenshots

### Home Page
- Hero banner with featured products
- Category cards
- Trending products
- Newsletter signup
- Footer with links

### Product Listing Page
- Product grid with images
- Sidebar filters (category, price, size)
- Sort dropdown
- Search bar with suggestions
- Pagination

### Product Details Page
- Product gallery with zoom
- Product description & specs
- Price and availability
- Size & color selection
- Add to cart button
- Customer reviews section
- Recommended products

### Shopping Cart
- Cart items list
- Item quantity controls
- Remove item button
- Cart summary (subtotal, tax, total)
- Proceed to checkout button
- Continue shopping link

### Checkout Process
1. **Shipping Address** — Enter delivery address
2. **Billing Address** — Same as shipping or different
3. **Payment Method** — Choose payment option
4. **Review Order** — Confirm order details
5. **Order Confirmation** — Success page with order number

### User Account
- Profile information
- Address book
- Order history
- Wishlist
- Account settings
- Logout

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
```
✓ Node.js 16+ (download from nodejs.org)
✓ npm 8+ (comes with Node.js)
✓ Angular CLI 15+ (npm install -g @angular/cli)
✓ Git for version control
```

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Angular CLI version
ng version
```

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Ajnasthayyil/Shoex-Frontend.git

# Navigate to project directory
cd Shoex-Frontend
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This installs all dependencies listed in package.json
```

### Step 3: Configure Environment

1. Open `src/environments/environment.ts`
2. Update the API base URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'  // Update with your API URL
};
```

For production, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.shoex.com/api'  // Your production API URL
};
```

### Step 4: Start Development Server

```bash
# Start Angular development server
ng serve

# Or using npm
npm start

# Navigate to: http://localhost:4200
# App will auto-reload on code changes
```

### Step 5: Build for Production

```bash
# Create optimized production build
ng build --configuration production

# Build output in dist/shoex-frontend/
```

---

## 📁 Project Structure

```
Shoex-Frontend/
│
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── register.component.ts
│   │   │   │   │   └── profile.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── components/
│   │   │   │   │   ├── product-list.component.ts
│   │   │   │   │   ├── product-detail.component.ts
│   │   │   │   │   └── product-filter.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── product.service.ts
│   │   │   │   └── products.module.ts
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── components/
│   │   │   │   │   └── cart.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── cart.service.ts
│   │   │   │   └── cart.module.ts
│   │   │   │
│   │   │   ├── checkout/
│   │   │   │   ├── components/
│   │   │   │   │   ├── shipping.component.ts
│   │   │   │   │   ├── payment.component.ts
│   │   │   │   │   └── confirmation.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── checkout.service.ts
│   │   │   │   └── checkout.module.ts
│   │   │   │
│   │   │   └── orders/
│   │   │       ├── components/
│   │   │       │   ├── order-list.component.ts
│   │   │       │   └── order-detail.component.ts
│   │   │       ├── services/
│   │   │       │   └── order.service.ts
│   │   │       └── orders.module.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── navbar.component.ts
│   │   │   │   ├── footer.component.ts
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   └── loader.component.ts
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── loading.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── token.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   ├── currency.pipe.ts
│   │   │   │   └── date.pipe.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── core.module.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── global.css
│   │
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _utilities.scss
│   │   └── styles.scss
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── index.html
│   └── main.ts
│
├── angular.json              # Angular CLI configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TS config
├── tailwind.config.js       # Tailwind CSS config
├── package.json             # Dependencies
├── package-lock.json        # Dependency lock file
├── karma.conf.js            # Testing configuration
├── .gitignore
├── README.md
└── Shoex-Frontend.code-workspace
```

---

## 🏛️ Component Architecture

### Module-Based Organization

The application is organized into **feature modules** to maintain clean separation of concerns:

```
App Module
├── Auth Module
│   ├── Login Component
│   ├── Register Component
│   └── Profile Component
├── Products Module
│   ├── Product List Component
│   ├── Product Detail Component
│   └── Product Filter Component
├── Cart Module
│   └── Cart Component
├── Checkout Module
│   ├── Shipping Component
│   ├── Payment Component
│   └── Confirmation Component
├── Orders Module
│   ├── Order List Component
│   └── Order Detail Component
└── Shared Module
    ├── Navbar Component
    ├── Footer Component
    ├── Services
    ├── Guards
    ├── Interceptors
    └── Pipes
```

### Component Examples

**Product List Component:**
```typescript
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$ = this.productService.getProducts();
  loading$ = this.loadingService.loading$;
  
  constructor(
    private productService: ProductService,
    private loadingService: LoadingService
  ) {}
  
  ngOnInit() {
    this.loadProducts();
  }
}
```

**Cart Service (State Management with RxJS):**
```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  
  addToCart(item: CartItem) {
    const current = this.cartSubject.value;
    this.cartSubject.next([...current, item]);
  }
}
```

---

## 🔌 Services & State Management

### Service Architecture

```
API Service (Central HTTP Layer)
    ↓
Domain Services (Auth, Product, Cart, Order)
    ↓
Components (Subscribe to observables)
    ↓
UI Updates (Auto-detect changes)
```

### Key Services

| Service | Purpose |
|---------|---------|
| **AuthService** | User authentication, JWT handling |
| **ProductService** | Product data, search, filtering |
| **CartService** | Cart management (state with BehaviorSubject) |
| **OrderService** | Order creation, tracking |
| **ApiService** | Centralized HTTP requests |
| **NotificationService** | Toasts, alerts, modals |
| **LoadingService** | Global loading state |

### State Management Pattern

```typescript
// Using RxJS BehaviorSubject for state
export class StateService {
  private state$ = new BehaviorSubject<AppState>(initialState);
  
  // Expose state as observable
  getState() {
    return this.state$.asObservable();
  }
  
  // Update state
  updateState(newState: Partial<AppState>) {
    const current = this.state$.value;
    this.state$.next({ ...current, ...newState });
  }
}
```

---

## 🛣️ Routing

### Main Routes

```typescript
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'orders', component: OrderListComponent },
          { path: 'addresses', component: AddressesComponent },
          { path: 'wishlist', component: WishlistComponent }
        ]
      }
    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
```

### Route Guards

```typescript
// AuthGuard protects routes requiring authentication
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
```

---

## 🎨 Styling

### Tailwind CSS + Angular Material

**Global Styles:**
```scss
// src/styles/styles.scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

// Custom variables
$primary: #3b82f6;
$secondary: #1e40af;
$success: #10b981;
$danger: #ef4444;
```

**Component Styling:**
```typescript
@Component({
  selector: 'app-product-card',
  template: `
    <div class="bg-white rounded-lg shadow-md p-4">
      <img [src]="product.image" class="w-full h-48 object-cover rounded">
      <h3 class="text-lg font-bold mt-2">{{ product.name }}</h3>
      <p class="text-gray-600">{{ product.price | currency }}</p>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product: Product;
}
```

### Responsive Breakpoints

```scss
// Mobile-first approach
$sm: 640px;    // Small devices
$md: 768px;    // Tablets
$lg: 1024px;   // Desktops
$xl: 1280px;   // Large screens

@media (min-width: $md) {
  // Tablet styles
}

@media (min-width: $lg) {
  // Desktop styles
}
```

---

## ⚡ Performance Optimization

### Code Splitting & Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module')
      .then(m => m.ProductsModule)
  }
];
```

### Change Detection Strategy
```typescript
@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {}
```

### OnPush Optimization
- Use OnPush change detection strategy
- Unsubscribe from observables with `takeUntil`
- Use `async` pipe in templates
- Memoize expensive computations

### Image Optimization
```html
<!-- Use responsive images -->
<img 
  [src]="product.image" 
  alt="Product image"
  loading="lazy"
  class="w-full object-cover"
>
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --stats-json
ng build --stats-json
webpack-bundle-analyzer dist/shoex-frontend/stats.json
```

---

## 🧪 Testing

### Run Unit Tests

```bash
# Run all tests
ng test

# Run with coverage
ng test --code-coverage

# Run in headless mode (CI/CD)
ng test --browsers=ChromeHeadless --watch=false
```

### Example Component Test

```typescript
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  
  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });
  
  it('should display products', () => {
    mockProductService.getProducts.and.returnValue(
      of([{ id: 1, name: 'Shoe', price: 100 }])
    );
    
    fixture.detectChanges();
    
    expect(component.products).toBeDefined();
  });
});
```

### Example Service Test

```typescript
describe('CartService', () => {
  let service: CartService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });
  
  it('should add item to cart', (done) => {
    const item = { id: 1, name: 'Shoe', quantity: 1 };
    service.addToCart(item);
    
    service.cart$.subscribe(cart => {
      expect(cart.length).toBe(1);
      done();
    });
  });
});
```

---

## 🚢 Deployment

### Build for Production

```bash
# Create optimized production build
ng build --configuration production

# Build with analytics
ng build --stats-json

# Output: dist/shoex-frontend/
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

### Deploy to Netlify

```bash
# Using Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/shoex-frontend
```

### Deploy to AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/shoex-frontend s3://your-bucket

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Environment Configuration for Deployment

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.shoex.com',
  logLevel: 'error'
};
```

---

## 🐛 Troubleshooting

### Common Issues

**Port 4200 Already in Use**
```bash
# Run on different port
ng serve --port 4201
```

**Module Not Found Error**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Build Failing with Memory Error**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

**CORS Error When Calling API**
- Ensure API server is running
- Check API base URL in environment.ts
- Verify API has CORS enabled

**Slow Build Times**
```bash
# Use faster build option
ng build --aot=false --build-optimizer=false --source-map=false
```

---

## 📚 Learning Resources

- [Angular Official Docs](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Material Components](https://material.angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Web Components Best Practices](https://www.webcomponents.org/)

---


### Code Style Guidelines
- Use Angular style guide
- Prefer functional components
- Write meaningful comments
- Keep components focused
- Follow naming conventions

---


## 📞 Contact & Support

Need help or have questions?

- **LinkedIn:** [Ajnas Thayyil](https://www.linkedin.com/in/ajnasthaayyil/)
- **Email:** [ajnasthayyil123@gmail.com](mailto:ajnasthayyil123@gmail.com)
- **WhatsApp:** [+91 7025882784](https://wa.me/917025882784)
- **Portfolio:** [ajnasthayyil.github.io/myportfolio](https://ajnasthayyil.github.io/myportfolio/)

---

<p align="center">
  <strong>Made with ❤️ by Ajnas Thayyil</strong>
  <br/>
  <a href="https://github.com/Ajnasthayyil">Follow on GitHub</a>
</p>

---

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Tailwind CSS for utility-first CSS
- Angular Material for UI components
- The open-source community

**Last Updated:** April 2026
