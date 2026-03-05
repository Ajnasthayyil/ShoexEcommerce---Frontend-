import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isEditing: boolean = false;
  updateForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.user = this.authService.getLoggedUser() || this.authService.getLoggedAdmin();
    this.initForm();
  }

  initForm() {
    this.updateForm = this.fb.group({
      fullName: [this.user?.fullName || this.user?.username || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      mobileNumber: [this.user?.mobileNumber || this.user?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initForm(); // reset form to current user values if they cancelled previous edits
    }
  }

  onUpdateProfile() {
    if (this.updateForm.invalid) {
      this.toastr.error('Please fill all required fields correctly');
      Object.keys(this.updateForm.controls).forEach(key => {
        this.updateForm.get(key)?.markAsTouched();
      });
      return;
    }

    const val = this.updateForm.value;
    const formData = new FormData();
    formData.append('FullName', val.fullName);
    formData.append('Email', val.email);
    formData.append('MobileNumber', val.mobileNumber);

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.toastr.success('Profile updated successfully');

        // Update local user object cautiously 
        // (Wait for next login/refresh to get full new token, but update UI immediately)
        this.user.fullName = val.fullName;
        this.user.email = val.email;
        this.user.mobileNumber = val.mobileNumber;

        // Save back to localstorage so it survives refresh
        if (localStorage.getItem('loggedUser')) {
          localStorage.setItem('loggedUser', JSON.stringify(this.user));
        } else if (localStorage.getItem('loggedAdmin')) {
          localStorage.setItem('loggedAdmin', JSON.stringify(this.user));
        }

        this.isEditing = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.message || 'Failed to update profile');
      }
    });
  }

  goToAddToCart() {
    this.router.navigate(['/cart']);
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  logout() {
    // Keep backend logout sync if it exists, otherwise just wipe local
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
