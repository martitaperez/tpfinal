import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Artist } from '../../models/artist.model';
import { ArtistService } from '../../services/artist.service';
import { UserService, UserModel } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-perfil-tatuadora',
  templateUrl: './perfil-tatuadora.html',
  styleUrls: ['./perfil-tatuadora.css']
})
export class PerfilTatuadoraComponent implements OnInit {

  artista: Artist | null = null;
  user: UserModel | null = null;

  // campos editables locales (para binding)
  editName = '';
  editIg = '';
  editStyles = ''; // comma separated
  editBio = '';
  editRating: number | null = null;

  editEmail = '';
  editPassword = '';
  cargando = true;

  constructor(
    private artistService: ArtistService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usr = this.authService.getUser();
    if (!usr) {
      this.router.navigate(['/login']);
      return;
    }

    // aseguramos usar el id correcto como number o string
    const userId = usr.id;

    this.userService.getById(userId).subscribe({
      next: u => {
        this.user = u;
        this.editEmail = u.email || '';
      },
      error: err => {
        console.error('Error cargando user', err);
        alert('No se pudo cargar la cuenta');
      }
    });

    this.artistService.getById(userId).subscribe({
      next: a => {
        this.artista = a;
        this.editName = a.name || '';
        this.editIg = a.ig || '';
        this.editStyles = (a.styles || []).join(', ');
        this.editBio = a.bio || '';
        this.editRating = a.rating ?? null;
        this.cargando = false;
      },
      error: err => {
        console.error('Error cargando artista', err);
        alert('No se pudo cargar el perfil de artista');
        this.cargando = false;
      }
    });
  }

  guardarArtista() {
    if (!this.artista) return;
    const patch: Partial<Artist> = {
      name: this.editName,
      ig: this.editIg,
      bio: this.editBio,
      styles: this.editStyles.split(',').map(s => s.trim()).filter(Boolean),
      rating: this.editRating ?? this.artista.rating
    };

    this.artistService.updateArtist(this.artista.id, patch).subscribe({
      next: () => {
        alert('Perfil de artista guardado');
        this.artistService.getById(this.artista!.id).subscribe(a => {
          this.artista = a;
          this.editStyles = (a.styles || []).join(', ');
        });
      },
      error: err => {
        console.error('Error guardando artista', err);
        alert('No se pudo guardar el perfil de artista');
      }
    });
  }

  guardarCuenta() {
    if (!this.user) return;

    const patch: Partial<UserModel> = {
      email: this.editEmail
    };
    if (this.editPassword && this.editPassword.trim().length > 0) {
      patch.password = this.editPassword.trim();
    }

    this.userService.updateUser(this.user.id, patch).subscribe({
      next: () => {
        alert('Cuenta guardada');
        this.userService.getById(this.user!.id).subscribe(u => {
          this.user = u;
          // actualizamos el user guardado en authService/localStorage
          this.authService.setUser(u as any);
        });
      },
      error: err => {
        console.error('Error guardando cuenta', err);
        alert('No se pudo guardar la cuenta');
      }
    });
  }

  volverAgenda() {
    this.router.navigate(['/tatuadora']);
  }
}