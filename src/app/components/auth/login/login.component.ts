import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        const user = res.user;
        if (user.role === 'student') this.router.navigate(['/student-dashboard']);
        else if (user.role === 'teacher') this.router.navigate(['/teacher-dashboard']);
        else if (user.role === 'admin') this.router.navigate(['/admin-dashboard']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Login failed. Please try again.';
        if (err.status === 403 && err.error.userId) {
          // If not verified, go to OTP verification
          this.router.navigate(['/verify-otp'], { queryParams: { userId: err.error.userId } });
        }
      }
    });
  }
}
