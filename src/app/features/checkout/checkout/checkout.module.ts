import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { checkoutComponent } from './checkout.component';
import { AddAddressComponent } from '../add-address/add-address.component';
import { AuthGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: checkoutComponent, canActivate: [AuthGuard] },
  { path: 'add-address', component: AddAddressComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    checkoutComponent,
    AddAddressComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CheckoutModule { }
