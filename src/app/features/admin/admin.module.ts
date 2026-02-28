import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

// Layout
import { AdminLayoutComponent } from './admin-layout/layout/layout.component';
import { HeaderComponent } from './admin-layout/header/header.component';
import { SidebarComponent } from './admin-layout/sidebar/sidebar.component';

// Pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { SalesStatisticsComponent } from './analytics/analytics.component';
import { UsersComponent } from './users/users.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    SalesStatisticsComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
    NgChartsModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
