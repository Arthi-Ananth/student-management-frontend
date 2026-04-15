import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  getAllUsers(role?: string): Observable<User[]> {
    const query = role ? `?role=${role}` : '';
    return this.api.get(`users${query}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`users/${id}`);
  }

  getMe(): Observable<User> {
    return this.api.get('users/me');
  }
}
