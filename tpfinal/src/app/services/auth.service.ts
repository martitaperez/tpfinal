import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private storageKey = 'user';
  private currentUser: User | null = null;

  constructor() {
    this.cargarDesdeLocalStorage();
  }

  // 🚀 Carga usuario guardado cuando se inicia Angular
  private cargarDesdeLocalStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      this.currentUser = null;
      return;
    }

    try {
      this.currentUser = JSON.parse(data) as User;
    } catch {
      console.warn("Error parseando user en localStorage");
      this.currentUser = null;
      localStorage.removeItem(this.storageKey);
    }
  }

  // 🔍 Devuelve el usuario logueado
  getUser(): User | null {
    return this.currentUser;
  }

  // 💾 Guarda usuario en memoria + localStorage
  private guardarUsuario(user: User) {
    this.currentUser = user;
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  // 🔐 Login
  login(user: User): boolean {
    if (!user) return false;

    this.guardarUsuario(user);
    return true;
  }

  // 🔓 Logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
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
}