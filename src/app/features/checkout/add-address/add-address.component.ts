import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html'
})
export class AddAddressComponent {
  name: string = '';
  phone: string = '';
  street: string = '';
  city: string = '';
  pincode: string = '';
  state: string = '';
  nameError: string = '';
  phoneError: string = '';
  streetError: string = '';
  cityError: string = '';
  pincodeError: string = '';
  stateError: string = '';

  constructor(private router: Router) {}

  saveAddress() {
    this.clearErrors();
    let isValid = true;

    if (!this.name.trim()) {
      this.nameError = 'Please enter your full name.';
      isValid = false;
    }
    if (!this.phone.trim() || !/^\d{10}$/.test(this.phone.trim())) {
      this.phoneError = 'Please enter a valid 10-digit phone number.';
      isValid = false;
    }
    if (!this.street.trim()) {
      this.streetError = 'Please enter your street address.';
      isValid = false;
    }
    if (!this.city.trim()) {
      this.cityError = 'Please enter your city.';
      isValid = false;
    }
    if (!this.pincode.trim() || !/^\d{6}$/.test(this.pincode.trim())) {
      this.pincodeError = 'Please enter a valid 6-digit pincode.';
      isValid = false;
    }
    if (!this.state.trim()) {
      this.stateError = 'Please enter your state.';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const address = {
      name: this.name.trim(),
      phone: this.phone.trim(),
      street: this.street.trim(),
      city: this.city.trim(),
      pincode: this.pincode.trim(),
      state: this.state.trim()
    };

    localStorage.setItem('userAddress', JSON.stringify(address));
    this.router.navigate(['/checkout']);
  }

  clearErrors() {
    this.nameError = '';
    this.phoneError = '';
    this.streetError = '';
    this.cityError = '';
    this.pincodeError = '';
    this.stateError = '';
  }

  validateName() {
    if (!this.name.trim()) {
      this.nameError = 'Please enter your full name.';
    } else {
      this.nameError = '';
    }
  }

  validatePhone() {
    if (!this.phone.trim() || !/^\d{10}$/.test(this.phone.trim())) {
      this.phoneError = 'Please enter a valid 10-digit phone number.';
    } else {
      this.phoneError = '';
    }
  }

  validateStreet() {
    if (!this.street.trim()) {
      this.streetError = 'Please enter your street address.';
    } else {
      this.streetError = '';
    }
  }

  validateCity() {
    if (!this.city.trim()) {
      this.cityError = 'Please enter your city.';
    } else {
      this.cityError = '';
    }
  }

  validatePincode() {
    if (!this.pincode.trim() || !/^\d{6}$/.test(this.pincode.trim())) {
      this.pincodeError = 'Please enter a valid 6-digit pincode.';
    } else {
      this.pincodeError = '';
    }
  }

  validateState() {
    if (!this.state.trim()) {
      this.stateError = 'Please enter your state.';
    } else {
      this.stateError = '';
    }
  }
}




