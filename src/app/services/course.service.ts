import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Course {
  _id?: string;
  title: string;
  code: string;
  description: string;
  teacher?: any;
  students?: any[];
  schedule: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private api: ApiService) {}

  getAllCourses(): Observable<Course[]> {
    return this.api.get('courses');
  }

  getCourseById(id: string): Observable<Course> {
    return this.api.get(`courses/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.api.post('courses', course);
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.api.put(`courses/${id}`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.api.delete(`courses/${id}`);
  }

  getCourseStudents(id: string): Observable<any[]> {
    return this.api.get(`courses/${id}/students`);
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.api.post(`courses/${courseId}/enroll`, {});
  }

  unenrollFromCourse(courseId: string): Observable<any> {
    return this.api.delete(`courses/${courseId}/enroll`);
  }
}
