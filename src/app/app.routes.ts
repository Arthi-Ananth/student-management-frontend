import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent) 
  },
  { 
    path: 'verify-otp', 
    loadComponent: () => import('./components/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) 
  },
  { 
    path: 'student-dashboard', 
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' },
    loadComponent: () => import('./components/dashboards/student/student.component').then(m => m.StudentDashboardComponent) 
  },
  { 
    path: 'teacher-dashboard', 
    canActivate: [authGuard, roleGuard],
    data: { role: 'teacher' },
    loadComponent: () => import('./components/dashboards/teacher/teacher.component').then(m => m.TeacherDashboardComponent) // Main teacher entry point 
  },
  { 
    path: 'admin-dashboard', 
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./components/dashboards/admin/admin.component').then(m => m.AdminDashboardComponent) 
  },
  { path: '**', redirectTo: '' }
];
