import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../services/user-state.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: ''
  };

  errorMsg = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private userState: UserStateService
  ) {}

  register() {
    this.errorMsg = '';

    // armamos el objeto para la API
    const nuevoUsuario: Partial<User> & { password: string } = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      role: 'client'   // todo el que se registra es cliente
    };

    this.api.addUsuario(nuevoUsuario).subscribe({
      next: (created: User) => {
        // loguear automáticamente
        this.auth.login(created);
        this.userState.setUser(created);

        // lo mando a pedir turno
        this.router.navigate(['/turnos']);
      },
      error: err => {
        console.error('Error registrando usuario', err);
        this.errorMsg = 'No se pudo registrar el usuario';
      }
    });
  }
}
