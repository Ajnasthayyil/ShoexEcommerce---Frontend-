import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    CartComponent
],
  imports: [
    CommonModule,
    CartRoutingModule,
    ToastrModule
  ],
    exports: [CartComponent]
})
export class CartModule { }
