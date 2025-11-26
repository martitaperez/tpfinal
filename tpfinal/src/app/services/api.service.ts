import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // USERS
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  addUsuario(usuario: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, usuario);
  }

  updateUsuario(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data);
  }

  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`);
  }

  // ARTISTS - list
  getArtists() {
    return this.http.get<any[]>(`${this.baseUrl}/artists`);
  }

  // ARTISTS - get personal profile
  getArtistByUserId(userId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/artists?userId=${userId}`)
      .pipe(map(a => a[0] || null));
  }

  // ARTISTS - update
  updateArtist(id: number, patch: any) {
    return this.http.patch(`${this.baseUrl}/artists/${id}`, patch);
  }
}

