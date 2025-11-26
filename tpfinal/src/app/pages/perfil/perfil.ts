import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {

  user: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'client'
  };

  mensajeGuardado = '';

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const u = this.auth.getUser();
    if (u) {
      this.user = { ...u }; // copia segura
    }
  }

  guardarCambios(): void {
    if (!this.user.id) return;

    const patch: Partial<User> = {
      name: this.user.name,
      apellido: this.user.apellido,
      email: this.user.email,
      phone: this.user.phone,
      password: this.user.password
    };

    this.api.updateUsuario(this.user.id, patch).subscribe({
      next: () => {
        this.mensajeGuardado = 'Datos guardados correctamente.';
        this.auth.login(this.user); // refresca localStorage
      },
      error: () => {
        alert('No se pudieron guardar los cambios.');
      }
    });
  }
}