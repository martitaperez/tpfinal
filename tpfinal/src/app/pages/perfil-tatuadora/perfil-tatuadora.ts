import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Artist } from '../../models/artist.model';
import { User } from '../../models/user.model';

import { ArtistService } from '../../services/artist.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-tatuadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-tatuadora.html',
  styleUrls: ['./perfil-tatuadora.css']
})
export class PerfilTatuadoraComponent implements OnInit {

  artista!: Artist;
  usuario!: User;

  textoEstilos: string = "";
  mensaje: string | null = null;

  constructor(
    private artistService: ArtistService,
    private authService: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = { ...user };

    // cargar artista
    this.artistService.getAll().subscribe(arts => {
      const art = arts.find(a => a.userId == user.id);

      if (!art) return;

      this.artista = art;
      this.textoEstilos = art.styles.join(', ');
    });
  }

  mostrarMensaje(texto: string) {
    this.mensaje = texto;
    setTimeout(() => (this.mensaje = null), 3000);
  }

  guardarDatosArtista() {
    if (!this.artista) return;

    this.artista.styles = this.textoEstilos
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.artistService
      .updateArtist(this.artista.id, this.artista)
      .subscribe(() => this.mostrarMensaje("Datos profesionales actualizados."));
  }

  guardarDatosUsuario() {
    if (!this.usuario.id) return;

    this.api.updateUsuario(this.usuario.id, this.usuario).subscribe(() => {
      this.authService.login(this.usuario);
      this.mostrarMensaje("Datos de usuario actualizados.");
    });
  }
}
