import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  mensaje: string | null = null;     
  esArtista = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const u = this.auth.getUser();
    if (u) {
      this.user = { ...u };
      this.esArtista = u.role === 'artist';
    }
  }

  
  mostrarMensaje(texto: string) {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = null, 3000);
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
        this.auth.login(this.user); // refresca localStorage
        this.mostrarMensaje("Datos guardados correctamente.");  
      },
      error: () => {
        this.mostrarMensaje("No se pudieron guardar los cambios.");  
      }
    });
  }

  irPerfilTatuadora(): void {
    this.router.navigate(['/perfil-tatuadora']);
  }
}