import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { ArtistService } from '../../services/artist.service';

import { Reserva } from '../../models/reserva.model';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-tatuadoras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tatuadoras.html',
  styleUrls: ['./tatuadoras.css']
})
export class TatuadorasComponent implements OnInit {

  reservas: Reserva[] = [];
  artistas: Artist[] = [];
  usuarioActualId!: number;
  esAdmin: boolean = false;

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
    private artistService: ArtistService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUser();
    if (!usuario) return;

    this.usuarioActualId = usuario.id;
    this.esAdmin = this.authService.isAdmin();

    this.cargarArtistas();
    this.cargarReservas();
  }

  cargarArtistas() {
    this.artistService.getAll().subscribe({
      next: data => this.artistas = data,
      error: err => {
        console.error("Error cargando artistas", err);
        alert("No se pudieron cargar los artistas.");
      }
    });
  }

  cargarReservas() {
    this.turnosService.getAll().subscribe({
      next: data => {
        if (this.esAdmin) {
          this.reservas = data;
        } else {
          this.reservas = data.filter(r => r.artistId === this.usuarioActualId);
        }
      },
      error: err => {
        console.error("Error cargando reservas", err);
        alert("No se pudieron cargar los turnos.");
      }
    });
  }

  // Función para mostrar el nombre del artista en el HTML
  getNombreArtist(artistId: number): string {
    const artista = this.artistas.find(a => a.id === artistId);
    return artista ? artista.name : 'Desconocido';
  }
}
