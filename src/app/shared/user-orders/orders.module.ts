import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { OrdersRoutingModule } from './orders-routing.module';
import { userOrdersComponent } from './user-orders.component';


@NgModule({
  declarations: [
    userOrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ToastrModule
  ]
})
export class OrdersModule { }
