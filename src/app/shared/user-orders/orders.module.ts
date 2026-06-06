import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { OrdersRoutingModule } from './orders-routing.module';
import { userOrdersComponent } from './user-orders.component';


@NgModule({
  declarations: [
    userOrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ToastrModule,
    FormsModule
  ]
})
export class OrdersModule { }
