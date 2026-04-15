import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService, User } from '../../../services/user.service';
import { CourseService, Course } from '../../../services/course.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'overview' | 'users' | 'courses' = 'overview';
  roleFilter: 'all' | 'student' | 'teacher' | 'admin' = 'all';

  users: User[] = [];
  courses: Course[] = [];
  loading = false;
  error = '';

  systemStats = [
    { label: 'Total Users', value: '0', icon: 'users', change: '+0' },
    { label: 'Total Courses', value: '0', icon: 'book', change: '+0' },
    { label: 'Students', value: '0', icon: 'dollar', change: '+0' },
    { label: 'Teachers', value: '0', icon: 'activity', change: '+0' }
  ];

  recentLogs = [
    { action: 'New user registered', user: 'System', time: 'Just now', type: 'info' },
    { action: 'Course created', user: 'Teacher', time: '5m ago', type: 'success' },
    { action: 'User enrolled in course', user: 'Student', time: '10m ago', type: 'info' },
  ];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        const students = users.filter(u => u.role === 'student').length;
        const teachers = users.filter(u => u.role === 'teacher').length;
        this.systemStats[0].value = users.length.toString();
        this.systemStats[2].value = students.toString();
        this.systemStats[3].value = teachers.toString();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
      }
    });

    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.systemStats[1].value = courses.length.toString();
      },
      error: () => {}
    });
  }

  get filteredUsers(): User[] {
    if (this.roleFilter === 'all') return this.users;
    return this.users.filter(u => u.role === this.roleFilter);
  }

  setTab(tab: 'overview' | 'users' | 'courses') {
    this.activeTab = tab;
    this.error = '';
  }

  setRoleFilter(role: 'all' | 'student' | 'teacher' | 'admin') {
    this.roleFilter = role;
  }

  deleteUser(user: User) {
    if (!confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) return;
    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== user._id);
        this.systemStats[0].value = this.users.length.toString();
        this.systemStats[2].value = this.users.filter(u => u.role === 'student').length.toString();
        this.systemStats[3].value = this.users.filter(u => u.role === 'teacher').length.toString();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete user';
      }
    });
  }

  deleteCourse(course: Course) {
    if (!confirm(`Delete "${course.title}"? This will unenroll all students.`)) return;
    this.courseService.deleteCourse(course._id!).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c._id !== course._id);
        this.systemStats[1].value = this.courses.length.toString();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete course';
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
