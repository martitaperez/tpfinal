import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private storageKey = 'user';
  private currentUser: User | null = null;

  constructor() {
    // Intento recuperar usuario guardado (si hay)
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved) as User;
      } catch {
        localStorage.removeItem(this.storageKey);
        this.currentUser = null;
      }
    } else {

      this.currentUser = {
        id: 10,
        name: "Rodrigo",
        apellido: "Dantas",
        email: "admin@test.com",
        role: "admin",
        phone: "123123"
      } as User;
      
    }
  }

  // Devuelve el usuario 
  getUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return null;
    try {
      this.currentUser = JSON.parse(saved) as User;
      return this.currentUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  setUser(user: User) {
    this.currentUser = user;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } catch (e) {
      console.warn('No se pudo guardar user en localStorage', e);
    }
  }


  login(user: User): boolean {
    if (!user || !user.role) {
      console.error("Login fallido: datos inválidos del usuario");
      return false;
    }
    this.setUser(user);
    return true;
  }

  logout(): boolean {
    if (!this.currentUser) {
      console.warn("Logout: no hay usuario logueado");
    
      localStorage.removeItem(this.storageKey);
      return false;
    }
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
    return true;
  }


  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  isArtist(): boolean {
    return this.getUser()?.role === 'artist' ;
  }

  isClient(): boolean {
    return this.getUser()?.role === 'client' ;
  }
}