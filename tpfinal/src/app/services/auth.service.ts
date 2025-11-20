import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: User | null = null;

  constructor() {
    // TEMPORAL — solo para que vos puedas probar todo sin login
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

  login(user: User) {
    this.currentUser = user;
  }

  logout() {
    this.currentUser = null;
  }
}
