import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private url = 'http://localhost:3000/turnos';

  constructor(private http: HttpClient) {}

  // Obtener todas las reservas
  getAll(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url).pipe(
      catchError(err => {
        console.error("❌ Error al obtener turnos:", err);
        return throwError(() => new Error("Error en GET turnos"));
      })
    );
  }

  // Obtener reserva por id
  getById(id: string | number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/${id}`).pipe(
      catchError(err => {
        console.error("❌ Error al obtener reserva por id:", err);
        return throwError(() => new Error("Error en GET reserva by id"));
      })
    );
  }

  // Crear nueva reserva
  crearReserva(reserva: Reserva): Observable<any> {
    return this.http.post(this.url, reserva).pipe(
      catchError(err => {
        console.error("❌ Error al crear reserva:", err);
        return throwError(() => new Error("Error en POST reserva"));
      })
    );
  }

  // Actualizar reserva
  updateReserva(id: string | number, reserva: Partial<Reserva>): Observable<any> {
    return this.http.patch(`${this.url}/${id}`, reserva).pipe(
      catchError(err => {
        console.error("❌ Error al actualizar reserva:", err);
        return throwError(() => new Error("Error en PATCH reserva"));
      })
    );
  }

  // Eliminar reserva por ID
  eliminarReserva(id: string | number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError(err => {
        console.error("❌ Error al eliminar reserva:", err);
        return throwError(() => new Error("Error en DELETE reserva"));
      })
    );
  }
}
