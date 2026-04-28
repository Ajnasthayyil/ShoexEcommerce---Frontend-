# 🛍️ Shoex Ecommerce Frontend

> A modern, feature-rich **Angular ecommerce storefront** built with **scalable architecture**, responsive design, and seamless API integration. Showcases real-world Angular patterns including lazy loading, guards, interceptors, and feature-based module organization.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS"/>
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm"/>
</p>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Feature Modules](#feature-modules)
- [Core Services](#core-services)
- [Guards & Interceptors](#guards--interceptors)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contact](#contact)

---

## 🎯 Overview

Shoex Ecommerce Frontend is a **production-ready Angular application** demonstrating industry-standard practices:

✅ **Feature-Based Architecture** — Organized by business domain (auth, products, cart, orders)  
✅ **Clean Code Patterns** — Guards, interceptors, lazy loading  
✅ **Role-Based Access** — Customer, Admin, Staff with route protection  
✅ **State Management** — RxJS observables and services  
✅ **Responsive Design** — Mobile-first approach with Tailwind CSS  
✅ **Error Handling** — Centralized interceptor for API errors  
✅ **JWT Authentication** — Secure token management & refresh logic  

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Angular 15+ | Frontend framework |
| **Language** | TypeScript 4.8+ | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State** | RxJS | Reactive programming |
| **HTTP** | HttpClient + Interceptors | API communication |
| **Package Manager** | npm | Dependency management |
| **Backend API** | ASP.NET Core REST | API server |

---

## 🏗️ Architecture

### Feature-Based Module Organization

```
App Module
├── Core Module (Singleton Services)
│   ├── Guards
│   ├── Interceptors
│   └── Services
│
├── Shared Module (Reusable)
│   ├── Components
│   ├── Pipes
│   └── Models
│
├── Layouts Module
│   ├── Header Component
│   └── Footer Component
│
└── Features (Lazy-Loaded Modules)
    ├── Auth Module
    │   ├── Login
    │   ├── Register
    │   └── Profile
    ├── Products Module
    │   ├── Product List
    │   ├── Product Detail
    │   └── Search
    ├── Cart Module
    │   └── Cart Management
    ├── Wishlist Module
    │   └── Wishlist Management
    ├── Orders Module
    │   ├── Order History
    │   └── Order Details
    └── Admin Module
        ├── Product Management
        ├── Order Management
        └── Dashboard
```

### Data Flow Architecture

```
Component
    ↓
Service (Observable)
    ↓
HttpClient + Interceptor (JWT Token)
    ↓
Backend API
    ↓
Response back to Component (via Observable)
    ↓
Template Update
```

### Routing with Lazy Loading

```typescript
// Modules loaded on-demand = faster initial load
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule),
    canActivate: [AuthGuard]
  }
];
```

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration & login
- JWT token management
- Token refresh mechanism
- Role-based route protection (AuthGuard)
- Logout with token cleanup

### 🛒 Shopping Features
- Browse products with filtering
- Add/remove from cart
- Wishlist management
- Cart persistence (localStorage)
- Real-time cart updates

### 📦 Order Management
- Create orders from cart
- View order history
- Track order status
- Order details & invoice
- Order cancellation

### 👥 Admin Panel
- Product management (CRUD)
- Order management
- User management
- Dashboard with analytics
- Role-based access control

### 📱 Responsive Design
- Mobile-first approach
- Tablet & desktop optimization
- Touch-friendly interface
- Adaptive layouts

### ♿ User Experience
- Error handling & notifications
- Loading states
- Form validation
- Smooth navigation
- Persistent authentication

---

## 📁 Project Structure (Detailed)

```
src/
│
├── app/
│   │
│   ├── core/                           # ⭐ Singleton Services
│   │   ├── services/
│   │   │   ├── auth.service.ts         # JWT, login, logout
│   │   │   ├── user.service.ts         # User data
│   │   │   ├── notification.service.ts # Toasts, alerts
│   │   │   └── api.service.ts          # Base API calls
│   │   │
│   │   ├── guards/
│   │   │   ├── auth.guard.ts           # Protect authenticated routes
│   │   │   ├── admin.guard.ts          # Protect admin routes
│   │   │   └── role.guard.ts           # Role-based access
│   │   │
│   │   └── interceptors/
│   │       ├── token.interceptor.ts    # Add JWT token to headers
│   │       └── error.interceptor.ts    # Handle API errors
│   │
│   ├── shared/                         # ⭐ Reusable Components
│   │   ├── components/
│   │   │   ├── navbar.component.ts
│   │   │   ├── footer.component.ts
│   │   │   ├── product-card.component.ts
│   │   │   ├── loading.component.ts
│   │   │   └── error.component.ts
│   │   │
│   │   ├── pipes/
│   │   │   ├── currency.pipe.ts
│   │   │   └── date.pipe.ts
│   │   │
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── cart.model.ts
│   │   │
│   │   └── shared.module.ts
│   │
│   ├── features/                       # ⭐ Feature Modules (Lazy-Loaded)
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── register.component.ts
│   │   │   │   └── profile.component.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── auth-routing.module.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── product-list.component.ts
│   │   │   │   ├── product-detail.component.ts
│   │   │   │   └── product-filter.component.ts
│   │   │   ├── services/
│   │   │   │   └── product.service.ts
│   │   │   ├── products-routing.module.ts
│   │   │   └── products.module.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   │   ├── cart.component.ts
│   │   │   │   └── cart-item.component.ts
│   │   │   ├── services/
│   │   │   │   └── cart.service.ts
│   │   │   ├── cart-routing.module.ts
│   │   │   └── cart.module.ts
│   │   │
│   │   ├── wishlist/
│   │   │   ├── components/
│   │   │   └── wishlist.component.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── components/
│   │   │   │   ├── order-list.component.ts
│   │   │   │   └── order-detail.component.ts
│   │   │   ├── services/
│   │   │   │   └── order.service.ts
│   │   │   └── orders.module.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── admin-dashboard.component.ts
│   │       │   ├── product-management.component.ts
│   │       │   └── order-management.component.ts
│   │       └── admin.module.ts
│   │
│   ├── layouts/
│   │   ├── header.component.ts
│   │   ├── footer.component.ts
│   │   ├── sidebar.component.ts
│   │   └── layouts.module.ts
│   │
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── products/
│
├── environments/
│   ├── environment.ts        # Development API URL
│   └── environment.prod.ts   # Production API URL
│
├── styles.css                # Global styles + Tailwind
├── index.html
└── main.ts

```

---

## 🚀 Getting Started

### Prerequisites

```bash
# Check versions
node --version      # 16+
npm --version       # 8+
ng version         # 15+
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Ajnasthayyil/ShoexEcommerce---Frontend-.git
cd ShoexEcommerce---Frontend-

# 2. Install dependencies
npm install

# 3. Configure API URL
# Edit: src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'  // Your API URL
};

# 4. Start development server
ng serve
# or
npm start

# 5. Open browser
# http://localhost:4200
```

---

## 🔌 Feature Modules (Lazy-Loaded)

Each feature module is **independently loadable** for better performance:

### **Auth Module** 🔐
```typescript
// auth/auth.module.ts
@NgModule({
  declarations: [LoginComponent, RegisterComponent, ProfileComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule]
})
export class AuthModule { }
```

**Components:**
- Login (email/password)
- Register (validation)
- Profile (user details)

**Service:**
```typescript
// auth/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string): Observable<{token: string}> {
    return this.http.post(`${this.apiUrl}/auth/login`, {email, password});
  }
  
  logout(): void {
    localStorage.removeItem('token');
  }
}
```

---

### **Products Module** 📦
```typescript
// products/products.module.ts
@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductFilterComponent
  ]
})
export class ProductsModule { }
```

**Components:**
- Product List (grid view with filters)
- Product Detail (full details + reviews)
- Product Filter (category, price, rating)

**Service:**
```typescript
// products/services/product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
```

---

### **Cart Module** 🛒
```typescript
// cart/cart.module.ts
@NgModule({
  declarations: [CartComponent, CartItemComponent]
})
export class CartModule { }
```

**Service with State Management:**
```typescript
// cart/services/cart.service.ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  
  addToCart(item: CartItem): void {
    const current = this.cartSubject.value;
    this.cartSubject.next([...current, item]);
  }
  
  getTotalPrice(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    );
  }
}
```

---

### **Orders Module** 📋
Create orders, track status, view history

### **Wishlist Module** ❤️
Add/remove products to wishlist

### **Admin Module** 👨‍💼
Product and order management (role-restricted)

---

## 🔐 Guards & Interceptors

### **AuthGuard** — Protect Routes

```typescript
// core/guards/auth.guard.ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
```

**Usage in Routes:**
```typescript
{
  path: 'cart',
  loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule),
  canActivate: [AuthGuard]  // ⭐ Protected route
}
```

---

### **Token Interceptor** — Add JWT to Requests

```typescript
// core/interceptors/token.interceptor.ts
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // ⭐ Add JWT to every request
        }
      });
    }
    
    return next.handle(request);
  }
}
```

---

### **Error Interceptor** — Handle API Errors

```typescript
// core/interceptors/error.interceptor.ts
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied.';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        }
        
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

---

## 🔐 Authentication Flow

### Login Process

```typescript
// User enters credentials
login(email: string, password: string) {
  return this.authService.login(email, password).pipe(
    tap(response => {
      localStorage.setItem('token', response.token);  // Store JWT
      this.authService.setLoggedIn(true);
    })
  );
}
```

### Protected API Calls

```typescript
// Every HTTP request automatically includes JWT
// Thanks to TokenInterceptor ⭐

this.http.get('/api/cart')  // Token added automatically
// Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Refresh

```typescript
// When token expires, refresh it
refreshToken(): Observable<{token: string}> {
  return this.http.post(`${this.apiUrl}/auth/refresh-token`, {
    refreshToken: localStorage.getItem('refreshToken')
  });
}
```

---

## 🌐 API Integration

### Environment Configuration

**Development:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api'
};
```

**Production:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.shoex.com/api'
};
```

### API Service (Centralized)

```typescript
// core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`);
  }
  
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, data);
  }
  
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${endpoint}`, data);
  }
  
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${endpoint}`);
  }
}
```

### Using API Service in Component

```typescript
// features/products/components/product-list.component.ts
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading = false;
  
  constructor(
    private productService: ProductService,
    private apiService: ApiService
  ) {}
  
  ngOnInit() {
    this.loading = true;
    this.products$ = this.apiService.get<Product[]>('/products').pipe(
      finalize(() => this.loading = false)
    );
  }
}
```

### Template Using Async Pipe

```html
<!-- automatic unsubscribe with async pipe -->
<div *ngIf="products$ | async as products">
  <app-product-card 
    *ngFor="let product of products"
    [product]="product">
  </app-product-card>
</div>
```

---

## 🧪 Testing

### Run Unit Tests

```bash
ng test
ng test --code-coverage
ng test --browsers=ChromeHeadless --watch=false  # CI/CD
```

### Example: Component Test

```typescript
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  
  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['get']);
    
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [{ provide: ApiService, useValue: mockApiService }]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });
  
  it('should load products on init', (done) => {
    const mockProducts = [
      { id: 1, name: 'Shoe 1', price: 100 },
      { id: 2, name: 'Shoe 2', price: 150 }
    ];
    
    mockApiService.get.and.returnValue(of(mockProducts));
    
    component.ngOnInit();
    
    component.products$.subscribe(products => {
      expect(products.length).toBe(2);
      done();
    });
  });
});
```

### Example: Service Test

```typescript
describe('CartService', () => {
  let service: CartService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });
  
  it('should add item to cart', (done) => {
    const item: CartItem = {
      id: 1,
      name: 'Shoe',
      price: 100,
      quantity: 1
    };
    
    service.addToCart(item);
    
    service.cart$.subscribe(cart => {
      expect(cart.length).toBe(1);
      expect(cart[0].name).toBe('Shoe');
      done();
    });
  });
  
  it('should calculate total price correctly', (done) => {
    const item1 = { id: 1, price: 100, quantity: 2 };
    const item2 = { id: 2, price: 50, quantity: 1 };
    
    service.addToCart(item1);
    service.addToCart(item2);
    
    service.getTotalPrice().subscribe(total => {
      expect(total).toBe(250);  // (100*2) + (50*1)
      done();
    });
  });
});
```


---

## 🐛 Troubleshooting

### Port 4200 Already in Use
```bash
ng serve --port 4201
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Error
- Verify Backend is running on `localhost:5001`
- Check `environment.ts` has correct API URL
- Verify CORS is enabled in backend

### Slow Build Time
```bash
ng build --aot=false --build-optimizer=false
```

---

## 📚 Learning Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Guide](https://rxjs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📞 Contact

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

**Last Updated:** April 2026
