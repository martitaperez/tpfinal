import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private storageKey = 'user';
  private currentUser: User | null = null;

  constructor() {
    this.cargarDesdeStorage();
  }

  
  private cargarDesdeStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.currentUser = null;
      return;
    }

    try {
      this.currentUser = JSON.parse(saved) as User;
    } catch (e) {
      console.warn("Error cargando usuario desde storage", e);
      localStorage.removeItem(this.storageKey);
      this.currentUser = null;
    }
  }

 
  getUser(): User | null {
    return this.currentUser;
  }

  
  private guardarUsuario(user: User | null) {
    this.currentUser = user;

    if (user) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  
  login(user: User): boolean {
    if (!user || !user.role) {
      console.error("Login fallido: usuario inválido");
      return false;
    }

    this.guardarUsuario(user);
    return true;
  }

 
  logout(): boolean {
    if (!this.currentUser) return false;

    this.guardarUsuario(null);
    return true;
  }

  // Roles
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isArtist(): boolean {
    return this.currentUser?.role === 'artist';
  }

  isClient(): boolean {
    return this.currentUser?.role === 'client';
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
