import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CourseService, Course } from '../../../services/course.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentDashboardComponent implements OnInit {
  user: any;
  availableCourses: Course[] = [];
  studentCourses: Course[] = [];
  enrollingId: string | null = null;
  unenrollingId: string | null = null;
  error = '';

  stats = [
    { label: 'Attendance', value: '94%', trend: '+2%', color: 'primary' },
    { label: 'Current GPA', value: '3.8', trend: '+0.1', color: 'success' },
    { label: 'Active Courses', value: '0', trend: '0', color: 'warning' },
    { label: 'Pending Tasks', value: '3', trend: '-1', color: 'danger' }
  ];

  constructor(
    private auth: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      if (user) this.loadCourses();
    });
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        const userId = this.user?._id || this.user?.id;
        this.studentCourses = courses.filter(c =>
          c.students?.some((s: any) => (s._id || s) === userId)
        );
        this.availableCourses = courses.filter(c =>
          !c.students?.some((s: any) => (s._id || s) === userId)
        );
        this.stats[2].value = this.studentCourses.length.toString();
      },
      error: (err) => { this.error = err.error?.message || 'Failed to load courses'; }
    });
  }

  enroll(courseId: string) {
    this.enrollingId = courseId;
    this.courseService.enrollInCourse(courseId).subscribe({
      next: () => {
        this.enrollingId = null;
        this.loadCourses();
      },
      error: (err) => {
        this.enrollingId = null;
        this.error = err.error?.message || 'Enrollment failed';
      }
    });
  }

  unenroll(courseId: string) {
    if (!confirm('Are you sure you want to unenroll from this course?')) return;
    this.unenrollingId = courseId;
    this.courseService.unenrollFromCourse(courseId).subscribe({
      next: () => {
        this.unenrollingId = null;
        this.loadCourses();
      },
      error: (err) => {
        this.unenrollingId = null;
        this.error = err.error?.message || 'Unenroll failed';
      }
    });
  }

  logout() { this.auth.logout(); }
}
