import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    // Try admin login first
    this.authService.loginAdmin({ username, password }).subscribe({
      next: (admin) => {
        this.toastr.success(`Welcome back, ${admin.fullName}!`, 'Admin Login Successful');
        this.router.navigate(['/admin']);
      },
      error: () => {
        // If not admin, try user login
        this.authService.login({ username, password }).subscribe({
          next: (user) => {
            this.toastr.success(`Welcome back, ${user.username}!`, 'Login Successful');
            this.cartService.reloadCart();
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.toastr.error(err.message || 'Invalid username or password', 'Login Failed');
          }
        });
      }
    });
  }
}