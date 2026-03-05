import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let authReq = request.clone({
            withCredentials: true
        });

        // Try getting token from User or Admin
        let token = null;
        const loggedUserStr = localStorage.getItem('loggedUser');
        const loggedAdminStr = localStorage.getItem('loggedAdmin');

        if (loggedUserStr) {
            const user = JSON.parse(loggedUserStr);
            if (user.token) token = user.token;
        } else if (loggedAdminStr) {
            const admin = JSON.parse(loggedAdminStr);
            if (admin.token) token = admin.token;
        }

        if (token) {
            authReq = authReq.clone({
                headers: authReq.headers.set('Authorization', `Bearer ${token}`)
            });
        }

        return next.handle(authReq);
    }
}
