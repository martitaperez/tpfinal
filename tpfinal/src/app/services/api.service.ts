import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3001';  // mismo puerto que usás con json-server

  constructor(private http: HttpClient) {}

  // USERS
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError(err => {
        console.error('❌ Error al obtener usuarios:', err);
        return throwError(() => new Error('Error GET /users'));
      })
    );
  }

  addUsuario(usuario: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, usuario).pipe(
      catchError(err => {
        console.error('❌ Error al agregar usuario:', err);
        return throwError(() => new Error('Error POST /users'));
      })
    );
  }

  updateUsuario(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data).pipe(
      catchError(err => {
        console.error('❌ Error al actualizar usuario:', err);
        return throwError(() => new Error('Error PUT /users/:id'));
      })
    );
  }

  // LOGIN: busca por email + password en /users
  login(email: string, password: string): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`)
      .pipe(
        catchError(err => {
          console.error('❌ Error en login:', err);
          return throwError(() => new Error('Error login /users'));
        })
      );
  }
}
