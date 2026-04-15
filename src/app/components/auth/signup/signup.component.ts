import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  userData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student'
  };
  error = '';
  loading = false;

  roles = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.auth.signup(this.userData).subscribe({
      next: (res: any) => {
        this.router.navigate(['/verify-otp'], { queryParams: { userId: res.userId } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Registration failed.';
      }
    });
  }
}
