import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { UserStateService } from './services/user-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, RouterLink, NgIf],
  template: `
    

    <nav>
      <a routerLink="/home">Inicio</a>

      @if (!user) {
        <a routerLink="/login">Ingresar</a>
        <a routerLink="/register">Registrarme</a>
      }

      @if (user) {
        <a routerLink="/perfil">Perfil</a>

        @if (user.role === 'admin') {
          <a routerLink="/admin">Admin</a>
        }

        @if (user.role === 'artist') {
          <a routerLink="/tatuadoras">Panel Tatuadora</a>
        }

        <a (click)="logout()" style="cursor:pointer;">Cerrar sesión</a>
      }
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      padding: 10px 0;
    }

    nav a {
      text-decoration: none;
      color: blue;
    }

    nav a:hover {
      text-decoration: underline;
    }
  `]
})
export class App {
  user: any = null;

  constructor(private userState: UserStateService) {
  this.loadUser();

  
  this.userState.user$.subscribe(u => {
    if (u) {
      this.user = u;
    }
  });
}

  loadUser() {
    const saved = localStorage.getItem('user');
    this.user = saved ? JSON.parse(saved) : null;
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;
    location.reload();
  }
}