import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  forgotForm!: FormGroup;
  otpForm!: FormGroup;
  resetForm!: FormGroup;

  viewMode: 'login' | 'forgot' | 'otp' | 'reset' = 'login';

  resetEmail: string = '';
  resetToken: string = '';

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

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    const parent = g as FormGroup;
    const newPass = parent.get('newPassword')?.value;
    const confirmPass = parent.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  switchView(mode: 'login' | 'forgot' | 'otp' | 'reset'): void {
    this.viewMode = mode;
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
            this.toastr.success(`Welcome back, ${user.fullName}!`, 'Login Successful');
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

  onForgotSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotForm.value.email;
    const formData = new FormData();
    formData.append('email', email);

    this.authService.forgotPassword(formData).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'OTP sent to your email.', 'Success');
        this.resetEmail = email;
        this.switchView('otp');
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to send OTP.', 'Error');
      }
    });
  }

  onOtpSubmit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const otp = this.otpForm.value.otp;
    const payload = { email: this.resetEmail, otp };

    this.authService.verifyOtp(payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'OTP verified successfully.', 'Success');
        this.resetToken = res.data;
        this.switchView('reset');
      },
      error: (err) => {
        this.toastr.error(err.message || 'Invalid OTP.', 'Error');
      }
    });
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const newPassword = this.resetForm.value.newPassword;
    const otp = this.otpForm.value.otp;
    const payload = {
      email: this.resetEmail,
      otp: otp,
      resetToken: this.resetToken,
      newPassword: newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Password reset successfully.', 'Success');

        this.resetEmail = '';
        this.resetToken = '';
        this.forgotForm.reset();
        this.otpForm.reset();
        this.resetForm.reset();
        this.switchView('login');
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to reset password.', 'Error');
      }
    });
  }
}