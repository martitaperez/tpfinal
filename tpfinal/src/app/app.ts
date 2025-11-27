import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';

import { UserStateService } from './services/user-state.service';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  user: User | null = null;

  // para menú responsive
  menuAbierto = false;

  constructor(
    private auth: AuthService,
    private userState: UserStateService,
    private router: Router
  ) {
    this.user = this.auth.getUser();

    this.userState.user$.subscribe(u => {
      this.user = u;
    });

    if (this.user) {
      this.userState.setUser(this.user);
    }
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  isLoggedIn() {
    return !!this.user;
  }

  isAdmin() {
    return this.user?.role === 'admin';
  }

  isArtist() {
    return this.user?.role === 'artist';
  }

  isClient() {
    return this.user?.role === 'client';
  }

  logout() {
    this.auth.logout();
    this.userState.setUser(null);
    this.cerrarMenu();
    this.router.navigate(['/home']);
  }
}