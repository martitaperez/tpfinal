import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private userState: UserStateService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  login() {
    this.errorMsg = '';
    this.loading = true;

   
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMsg = 'Completá todos los campos.';
      this.loading = false;
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValid) {
      this.errorMsg = 'Ingresá un email válido.';
      this.loading = false;
      return;
    }

    if (this.password.length < 3) {
      this.errorMsg = 'La contraseña es demasiado corta.';
      this.loading = false;
      return;
    }

    
    this.api.login(this.email, this.password).subscribe({
      next: (users: User[]) => {
        this.loading = false;

        if (Array.isArray(users) && users.length === 1) {
          const user = users[0];

         
          this.auth.login(user);
          this.userState.setUser(user);

          
          const redirect = this.route.snapshot.queryParams['redirectTo'];
          if (redirect) {
            this.router.navigate(['/' + redirect]);
            return;
          }

         
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'artist') {
            this.router.navigate(['/tatuadoras']);
          } else {
            this.router.navigate(['/turnos']);
          }

        } else {
          this.errorMsg = 'Email o contraseña incorrectos.';
        }
      },

      error: () => {
        this.loading = false;
        this.errorMsg = 'No se pudo iniciar sesión.';
      }
    });
  }
}
