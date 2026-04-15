import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit {
  userId = '';
  otp = '';
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (!this.userId) {
        this.router.navigate(['/signup']);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.verifyOtp(this.userId, this.otp).subscribe({
      next: (res) => {
        const user = res.user;
        if (user.role === 'student') this.router.navigate(['/student-dashboard']);
        else if (user.role === 'teacher') this.router.navigate(['/teacher-dashboard']);
        else if (user.role === 'admin') this.router.navigate(['/admin-dashboard']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Verification failed. Please check your OTP.';
      }
    });
  }

  resendOtp() {
    this.error = '';
    this.auth.resendOtp(this.userId).subscribe({
      next: () => {
        alert('A new OTP has been sent to your email.');
      },
      error: (err) => {
        this.error = err.error.message || 'Failed to resend OTP.';
      }
    });
  }
}
