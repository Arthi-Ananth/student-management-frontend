import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CourseService, Course } from '../../../services/course.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherDashboardComponent implements OnInit {
  user: any;
  courses: Course[] = [];
  showCourseForm = false;
  editingCourse: Course | null = null;
  viewingStudents: { courseTitle: string, students: any[] } | null = null;

  newCourse: Course = { title: '', code: '', description: '', schedule: '' };
  error = '';

  teacherStats = [
    { label: 'Total Students', value: '0', icon: 'users', color: 'primary' },
    { label: 'Active Courses', value: '0', icon: 'calendar', color: 'warning' },
    { label: 'Average Grade', value: 'B+', icon: 'trending-up', color: 'success' },
    { label: 'Pending Tasks', value: '0', icon: 'file-text', color: 'danger' }
  ];

  constructor(
    private auth: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => { this.user = user; });
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        // Filter to only show courses created by this teacher
        this.courses = courses.filter(c =>
          this.user && (c.teacher?._id === this.user.id || c.teacher?._id === this.user._id)
        );
        this.teacherStats[0].value = this.courses.reduce((acc, c) => acc + (c.students?.length || 0), 0).toString();
        this.teacherStats[1].value = this.courses.length.toString();
      },
      error: (err) => { this.error = err.error?.message || 'Failed to load courses'; }
    });
  }

  openCreateForm() {
    this.editingCourse = null;
    this.newCourse = { title: '', code: '', description: '', schedule: '' };
    this.showCourseForm = true;
  }

  openEditForm(course: Course) {
    this.editingCourse = course;
    this.newCourse = { ...course };
    this.showCourseForm = true;
  }

  submitCourseForm() {
    if (this.editingCourse) {
      this.courseService.updateCourse(this.editingCourse._id!, this.newCourse).subscribe({
        next: (updated) => {
          const idx = this.courses.findIndex(c => c._id === updated._id);
          if (idx !== -1) this.courses[idx] = updated;
          this.closeForm();
        },
        error: (err) => { this.error = err.error?.message || 'Failed to update course'; }
      });
    } else {
      this.courseService.createCourse(this.newCourse).subscribe({
        next: (course) => {
          this.courses.push(course);
          this.teacherStats[1].value = this.courses.length.toString();
          this.closeForm();
        },
        error: (err) => { this.error = err.error?.message || 'Error creating course'; }
      });
    }
  }

  deleteCourse(course: Course) {
    if (!confirm(`Delete "${course.title}"? All students will be unenrolled.`)) return;
    this.courseService.deleteCourse(course._id!).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c._id !== course._id);
        this.teacherStats[1].value = this.courses.length.toString();
      },
      error: (err) => { this.error = err.error?.message || 'Failed to delete course'; }
    });
  }

  viewStudents(course: Course) {
    this.courseService.getCourseStudents(course._id!).subscribe({
      next: (students) => {
        this.viewingStudents = { courseTitle: course.title, students };
      },
      error: (err) => { this.error = err.error?.message || 'Failed to load students'; }
    });
  }

  closeForm() {
    this.showCourseForm = false;
    this.editingCourse = null;
    this.newCourse = { title: '', code: '', description: '', schedule: '' };
  }

  logout() { this.auth.logout(); }
}
