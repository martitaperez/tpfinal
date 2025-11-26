import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserStateService } from '../../services/user-state.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private userState: UserStateService,
    private auth: AuthService
  ) {}

  login() {
    this.errorMsg = '';

    this.api.login(this.email, this.password).subscribe({
      next: (users: User[]) => {
        if (Array.isArray(users) && users.length === 1) {
          const user = users[0];

          // guardar en AuthService + localStorage
          this.auth.login(user);

          // avisar al menú
          this.userState.setUser(user);

          // redirigir según rol
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'artist') {
            this.router.navigate(['/tatuadoras']);
          } else {
            this.router.navigate(['/turnos']);
          }

        } else {
          this.errorMsg = 'Email o contraseña incorrectos';
        }
      },
      error: () => {
        this.errorMsg = 'No se pudo iniciar sesión';
      }
    });
  }
}
