import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  signup(userData: any) {
    return this.api.post('auth/signup', userData);
  }

  verifyOtp(userId: string, otp: string) {
    return this.api.post('auth/verify-otp', { userId, otp }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  resendOtp(userId: string) {
    return this.api.post('auth/resend-otp', { userId });
  }

  login(credentials: any) {
    return this.api.post('auth/login', credentials).pipe(
      tap(res => {
        if (res.token) {
          this.handleAuth(res);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuth(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.userSubject.next(res.user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    const user = this.userSubject.value;
    return user ? user.role : null;
  }
}
