import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: User | null = null;

  constructor() {
    // TEMPORAL — solo para probar sin login real
    this.currentUser = {
      id: 1,
      name: "Rodrigo",
      apellido: "Dantas",
      email: "admin@test.com",
      role: "admin",
      phone: "123123"
    };
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isArtist(): boolean {
    return this.currentUser?.role === 'artist';
  }

  isClient(): boolean {
    return this.currentUser?.role === 'client';
  }

  login(user: User): boolean {
    if (!user || !user.role) {
      console.error("Login fallido: datos inválidos del usuario");
      return false;
    }
    this.currentUser = user;
    return true;
  }

  logout(): boolean {
    if (!this.currentUser) {
      console.warn("Logout fallido: no hay usuario logueado");
      return false;
    }
    this.currentUser = null;
    return true;
  }
}
