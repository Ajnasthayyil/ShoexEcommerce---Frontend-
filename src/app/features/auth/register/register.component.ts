import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9._%+\-]*@[a-z0-9.\-]+\.[a-z]{2,}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{9}$/)]],
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]\S*$/), Validators.minLength(3), Validators.maxLength(30)], [this.usernameAsyncValidator()]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/)]]
    });
  }



  usernameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;
      if (!username) {
        return new Observable(observer => observer.next(null));
      }
      return this.authService.checkUsernameExists(username).pipe(
        map(exists => exists ? { usernameExists: true } : null)
      );
    };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.value;
    const userData = {
      fullName: formValues.fullName,
      email: formValues.email,
      mobileNumber: formValues.mobile,
      username: formValues.username,
      password: formValues.password
    };

    // Proceed with registration
    this.authService.register(userData).subscribe({
      next: () => {
        this.toastr.success('Registration Successful! Please Login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error?.message || err.error || 'Registration failed. Please try again.');
      }
    });
  }
}
