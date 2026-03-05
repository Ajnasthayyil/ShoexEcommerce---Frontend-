import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressService, AddressDto, AddAddressDto } from 'src/app/core/services/address.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html'
})
export class AddAddressComponent implements OnInit {
  addresses: AddressDto[] = [];
  addressForm!: FormGroup;

  isEditing = false;
  editingId: number | null = null;

  isLoadingList = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadAddresses();
  }

  initForm() {
    // Exact strict regex patterns requested by C# backend
    const startsWithLetter = '^[A-Za-z][A-Za-z0-9\\s,.-]*$';

    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(startsWithLetter)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      street: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200), Validators.pattern(startsWithLetter)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(startsWithLetter)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(startsWithLetter)]],
      pincode: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      isDefault: [false]
    });
  }

  loadAddresses() {
    this.isLoadingList = true;
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        // Handle varying possible nested API array returns flexibly
        this.addresses = res.data || res || [];
        this.isLoadingList = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load saved addresses', 'Error');
        this.isLoadingList = false;
      }
    });
  }

  // Getters for form controls to simplify HTML template access
  get f() { return this.addressForm.controls; }

  onSubmitAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const dto: AddAddressDto = this.addressForm.value;

    if (this.isEditing && this.editingId) {
      this.addressService.updateAddress(this.editingId, dto).subscribe({
        next: () => {
          this.toastr.success('Address updated successfully!', 'Address Saved');
          this.resetForm();
          this.loadAddresses();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastr.error(err.error?.message || err.error || 'Failed to update address', 'Update Error');
          this.isSubmitting = false;
        }
      });
    } else {
      this.addressService.addAddress(dto).subscribe({
        next: () => {
          this.toastr.success('New address added successfully!', 'Address Saved');
          this.resetForm();
          this.loadAddresses();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastr.error(err.error?.message || err.error || 'Failed to capture new address', 'Add Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  editAddress(address: AddressDto) {
    this.isEditing = true;
    this.editingId = address.id;
    this.addressForm.patchValue({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });

    // Smooth scroll back to form input area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = null;
    this.addressForm.reset({ isDefault: false });
  }

  deleteAddress(id: number) {
    if (confirm('Are you sure you want to permanently delete this address?')) {
      this.addressService.deleteAddress(id).subscribe({
        next: () => {
          this.toastr.success('Address removed from your profile', 'Deleted');
          this.loadAddresses();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Failed to delete address', 'Error');
        }
      });
    }
  }

  setDefaultAddress(id: number) {
    this.addressService.setDefaultAddress(id).subscribe({
      next: () => {
        this.toastr.success('Default delivery address updated!', 'Success');
        this.loadAddresses();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update default address', 'Error');
      }
    });
  }

  continueToCheckout() {
    const defaultAddress = this.addresses.find(a => a.isDefault);

    if (defaultAddress) {
      localStorage.setItem('selectedAddressId', defaultAddress.id.toString());
      this.router.navigate(['/checkout']);
    } else if (this.addresses.length > 0) {
      // If none set to default, safely pick the first one from their list
      localStorage.setItem('selectedAddressId', this.addresses[0].id.toString());
      this.toastr.info('Using your first available address for checkout.', 'Note');
      this.router.navigate(['/checkout']);
    } else {
      this.toastr.warning('Please add and save a delivery address before continuing to checkout.', 'Address Required');
    }
  }
}



