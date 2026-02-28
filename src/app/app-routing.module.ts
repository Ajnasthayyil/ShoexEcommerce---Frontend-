import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { AboutComponent } from './shared/about/about.component';
import { contactComponent } from './shared/contact/contact.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './shared/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AdminAuthGuard } from './core/guards/admin.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: contactComponent },
  { path: 'product-details/:id', canActivate: [AuthGuard], component: ProductDetailsComponent },
  { path: 'products-list', component: ProductListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', loadChildren: () => import('./features/cart/cart/cart.module').then(m => m.CartModule), canActivate: [AuthGuard] },
  { path: 'checkout', loadChildren: () => import('./features/checkout/checkout/checkout.module').then(m => m.CheckoutModule) },
  { path: 'orders', loadChildren: () => import('./shared/user-orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuard] },
  { path: 'wishlist', loadChildren: () => import('./features/wishlist/wishlist/wishlist.module').then(m => m.WishlistModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminAuthGuard] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
