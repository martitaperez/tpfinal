import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Turnos
  getTurnos() {
    return this.http.get(`${this.baseUrl}/turnos`);
  }

  addTurno(turno: any) {
    return this.http.post(`${this.baseUrl}/turnos`, turno);
  }

  // Usuarios (sin validación real)
  getUsuarios() {
    return this.http.get(`${this.baseUrl}/usuarios`);
  }

  addUsuario(usuario: any) {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario);
  }
}
