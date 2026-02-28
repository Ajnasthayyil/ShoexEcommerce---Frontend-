import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasUserOrAdmin());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  private hasUserOrAdmin(): boolean {
    return !!(localStorage.getItem('loggedUser') || localStorage.getItem('loggedAdmin'));
  }

  private performLogin(credentials: { username: string; password: string }): Observable<any> {
    const opts = { withCredentials: true };

    return this.http.post<any>(`${this.apiUrl}/Auth/login`, credentials, opts).pipe(
      switchMap(res => {
        if (!res?.isSuccess) {
          return throwError(() => new Error(res?.message || 'Login failed'));
        }
        // IMPORTANT: send cookies here too
        return this.http.get<any>(`${this.apiUrl}/Auth/my-profile`, opts);
      }),
      map(profileRes => profileRes.data || profileRes),
      catchError(err => throwError(() => err))
    );
  }

  loginAdmin(credentials: { username: string; password: string }): Observable<any> {
    return this.performLogin(credentials).pipe(
      map(profile => {
        const isAdmin =
          profile.roleId === 1 ||
          profile.role === 'Admin' ||
          profile.role === 'Administrator' ||
          (profile.roles && profile.roles.includes('Admin'));

        if (!isAdmin) throw new Error('User is not an admin');

        localStorage.setItem('loggedAdmin', JSON.stringify(profile));
        localStorage.setItem('isAdmin', 'true');
        this.loggedInSubject.next(true);
        return profile;
      })
    );
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.performLogin(credentials).pipe(
      map(profile => {
        if (profile.isBlocked || profile.isBlock) {
          throw new Error('Your account has been blocked. Please contact support.');
        }
        localStorage.setItem('loggedUser', JSON.stringify(profile));
        this.loggedInSubject.next(true);
        return profile;
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/register`, userData).pipe(
      map(res => {
        if (!res.isSuccess) {
          throw new Error(res.message || 'Registration failed');
        }
        return res;
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/Auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession(),
    });
  }

  private clearLocalSession() {
    localStorage.removeItem('loggedAdmin');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('isAdmin');
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasUserOrAdmin();
  }

  getLoggedAdmin(): any {
    const data = localStorage.getItem('loggedAdmin');
    return data ? JSON.parse(data) : null;
  }

  getLoggedUser(): any {
    const data = localStorage.getItem('loggedUser');
    return data ? JSON.parse(data) : null;
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return of(false);
  }
}