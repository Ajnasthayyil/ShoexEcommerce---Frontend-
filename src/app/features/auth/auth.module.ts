import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    ToastrModule
  ],
 exports:[
  LoginComponent,
  RegisterComponent,
 ]
}

)

   
  
export class AuthModule {}

