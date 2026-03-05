import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    // Check if the error is specifically due to being blocked
                    const errorMessage = error.error?.message || error.error || '';
                    const isBlocked = typeof errorMessage === 'string' &&
                        (errorMessage.toLowerCase().includes('blocked') || errorMessage.toLowerCase().includes('inactive'));

                    if (isBlocked) {
                        this.toastr.error('Your account has been blocked or is inactive. You have been logged out.', 'Access Denied');
                        this.authService.logout();
                        this.router.navigate(['/auth/login']);
                    }
                }

                const err = error.error?.message || error.statusText;
                return throwError(() => new Error(err));
            })
        );
    }
}
