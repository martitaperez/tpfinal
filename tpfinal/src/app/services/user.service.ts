import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UserModel {
  id: number;
  username: string;
  email?: string;
  password?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3001/users';

  constructor(private http: HttpClient) {}

  getById(id: string | number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.url}/${id}`).pipe(
      catchError(err => {
        console.error('Error GET user by id', err);
        return throwError(() => new Error('Error GET user'));
      })
    );
  }

  updateUser(id: string | number, patch: Partial<UserModel>) {
    return this.http.patch(`${this.url}/${id}`, patch).pipe(
      catchError(err => {
        console.error('Error PATCH user', err);
        return throwError(() => new Error('Error PATCH user'));
      })
    );
  }
}

