import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UserModel {
  id: number;
  name: string;
  apellido?: string;
  email: string;
  password: string;
  role: 'admin' | 'artist' | 'client';
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // Obtener usuario por Id
  getById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.url}/${id}`).pipe(
      catchError(err => {
        console.error("❌ Error GET user by id:", err);
        return throwError(() => new Error("Error GET user by id"));
      })
    );
  }

  // Actualizar usuario
  updateUser(id: number, patch: Partial<UserModel>): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.url}/${id}`, patch).pipe(
      catchError(err => {
        console.error("❌ Error PATCH user:", err);
        return throwError(() => new Error("Error PATCH user"));
      })
    );
  }
}
