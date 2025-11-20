import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // TURNOS
  getTurnos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/turnos`).pipe(
      catchError(err => {
        console.error("❌ Error al obtener turnos:", err);
        return throwError(() => new Error("Error GET /turnos"));
      })
    );
  }

  addTurno(turno: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/turnos`, turno).pipe(
      catchError(err => {
        console.error("❌ Error al agregar turno:", err);
        return throwError(() => new Error("Error POST /turnos"));
      })
    );
  }

  // USUARIOS
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`).pipe(
      catchError(err => {
        console.error("❌ Error al obtener usuarios:", err);
        return throwError(() => new Error("Error GET /usuarios"));
      })
    );
  }

  addUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario).pipe(
      catchError(err => {
        console.error("❌ Error al agregar usuario:", err);
        return throwError(() => new Error("Error POST /usuarios"));
      })
    );
  }
}
