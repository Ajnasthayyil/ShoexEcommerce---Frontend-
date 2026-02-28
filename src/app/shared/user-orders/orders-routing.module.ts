import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userOrdersComponent } from './user-orders.component';

const routes: Routes = [
  {path:'',component:userOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
