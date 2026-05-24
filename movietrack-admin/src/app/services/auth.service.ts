import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('role', res.user.role);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem('role') === 'admin';
  }
}