import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav>
      <a routerLink="/home">Home</a>
      <a routerLink="/login">Login</a>
      <a routerLink="/register">Register</a>
      <a routerLink="/tatuadoras">Tatuadoras</a>
      <a routerLink="/turnos">Turnos</a>
      <a routerLink="/admin">Admin</a>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    nav { display: flex; gap: 15px; margin-bottom: 20px; }
  `]
})
export class App {}
