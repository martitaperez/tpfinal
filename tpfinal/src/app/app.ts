import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { UserStateService } from './services/user-state.service';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, RouterLink, NgIf],
  template: `
    <nav>
      <a routerLink="/home">Inicio</a>

      <!-- Cliente: puede pedir turnos -->
      <a routerLink="/turnos" *ngIf="isClient()">Turnos</a>

      <!-- Artista: ve sus propios turnos -->
      <a routerLink="/tatuadoras" *ngIf="isArtist()">Mis turnos</a>

      <!-- Admin: panel de administración -->
      <a routerLink="/admin" *ngIf="isAdmin()">Admin</a>

      <!-- Perfil (si querés usarlo luego) -->
      <a routerLink="/perfil" *ngIf="isLoggedIn()">Mi perfil</a>

      <!-- Auth -->
      <a routerLink="/login" *ngIf="!isLoggedIn()">Login</a>
      <a routerLink="/register" *ngIf="!isLoggedIn()">Registrarse</a>

      <span *ngIf="isLoggedIn()" style="margin-left: 1rem;">
        {{ user?.name }} ({{ user?.role }})
      </span>

      <button *ngIf="isLoggedIn()" (click)="logout()" style="margin-left: .5rem;">
        Cerrar sesión
      </button>
    </nav>

    <hr />

    <router-outlet></router-outlet>
  `
})
export class App {

  user: User | null = null;

  constructor(
    private auth: AuthService,
    private userState: UserStateService,
    private router: Router
  ) {
    // usuario inicial
    this.user = this.auth.getUser();

    this.userState.user$.subscribe(u => {
      this.user = u;
    });

    // si había usuario en localStorage, lo reinyectamos al state
    if (this.user) {
      this.userState.setUser(this.user);
    }
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  isArtist(): boolean {
    return this.user?.role === 'artist';
  }

  isClient(): boolean {
    return this.user?.role === 'client';
  }

  logout() {
    this.auth.logout();
    this.userState.setUser(null);
    this.router.navigate(['/home']);
  }
}
