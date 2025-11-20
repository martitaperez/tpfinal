import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent {

  user: any = {};

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit() {
    const u = this.auth.getUser();
    if (u) {
      this.user = { ...u }; 
    }
  }

  guardarCambios() {
    if (!this.user.id) return;

    this.api.updateUsuario(this.user.id, this.user).subscribe(() => {
      alert("Datos guardados correctamente");

      
      this.auth.login(this.user);
    });
  }
}
