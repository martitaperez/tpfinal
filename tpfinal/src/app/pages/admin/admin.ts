import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TurnosService } from '../../services/turnos.service';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { Reserva } from '../../models/reserva.model';
import { Artist } from '../../models/artist.model';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  reservas: Reserva[] = [];
  artists: Artist[] = [];
  admin: User | null = null;

  loading = true;
  msg = '';

  showTurnos = false;
  showArtists = false;

  // edición turnos
  editingReservaId: number | null = null;
  reservaDraft: Partial<Reserva> | null = null;

  // edición artistas
  editingArtistId: number | null = null;
  artistDraft: Partial<Artist> | null = null;

  // add artist
  newArtist: Partial<Artist> = {};
  newArtistStyles = '';

  // ejemplo de estilos disponibles
  allStyles = ['Realismo', 'Tradicional', 'Acuarela', 'Neotradicional', 'Blackwork'];

  constructor(
    private turnosService: TurnosService,
    private artistService: ArtistService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarAdmin();
    this.cargarDatos();
  }

  cargarAdmin() {
    this.userService.getById(1).subscribe({
      next: u => this.admin = u,
      error: () => this.admin = null
    });
  }

  cargarDatos() {
    this.loading = true;
    this.turnosService.getAll().subscribe({
      next: t => {
        this.reservas = t;
        this.artistService.getAll().subscribe({
          next: a => {
            this.artists = a;
            this.loading = false;
          },
          error: () => { this.artists = []; this.loading = false; }
        });
      },
      error: () => { this.reservas = []; this.loading = false; }
    });
  }

  // TURNOS
  toggleTurnos() { this.showTurnos = !this.showTurnos; if (this.showTurnos) this.cargarDatos(); }

  editReserva(r: Reserva) { this.editingReservaId = r.id; this.reservaDraft = { ...r }; }

  saveReserva() {
    if (!this.reservaDraft || this.editingReservaId == null) return;
    this.turnosService.updateReserva(this.editingReservaId, this.reservaDraft).subscribe({
      next: () => { this.msg = 'Reserva actualizada'; this.editingReservaId = null; this.reservaDraft = null; this.cargarDatos(); setTimeout(() => this.msg = '', 1800); },
      error: () => this.msg = 'Error al actualizar reserva'
    });
  }

  cancelEditReserva() { this.editingReservaId = null; this.reservaDraft = null; }

  borrarTurno(id: number) {
    if (!confirm('¿Eliminar reserva?')) return;
    this.turnosService.eliminarReserva(id).subscribe({
      next: () => { this.reservas = this.reservas.filter(r => r.id !== id); this.msg = 'Reserva eliminada'; setTimeout(()=> this.msg = '', 1400); },
      error: () => this.msg = 'Error al eliminar reserva'
    });
  }

  // ARTISTAS
  toggleArtists() { this.showArtists = !this.showArtists; if (this.showArtists) this.cargarDatos(); }

  editArtist(a: Artist) { 
    this.editingArtistId = a.id; 
    this.artistDraft = { ...a }; 
  }

  saveArtist() {
    if (!this.artistDraft || this.editingArtistId == null) return;
    const patch: Partial<Artist> = { ...this.artistDraft };
    this.artistService.updateArtist(this.editingArtistId, patch).subscribe({
      next: () => { this.msg = 'Artista actualizado'; this.editingArtistId = null; this.artistDraft = null; this.cargarDatos(); setTimeout(()=> this.msg='',1400); },
      error: () => this.msg = 'Error al actualizar artista'
    });
  }

  cancelEditArtist() { this.editingArtistId = null; this.artistDraft = null; }

  deleteArtist(id: number) {
    if (!confirm('¿Eliminar artista?')) return;
    this.http.delete(`http://localhost:3000/artists/${id}`).subscribe({
      next: () => { this.artists = this.artists.filter(a => a.id !== id); this.msg = 'Artista eliminado'; setTimeout(()=> this.msg='',1400); },
      error: () => this.msg = 'Error al eliminar artista'
    });
  }
  openAdminProfile() {
  if (!this.admin?.id) return;
  // Navega a la ruta de perfil, pasando el id del admin
  this.router.navigate(['/perfil'], { queryParams: { tipo: 'admin', id: this.admin.id } });
}

  addArtist() {
    const styles = (this.newArtistStyles || '').split(',').map(s => s.trim()).filter(s => s);
    const payload: Partial<Artist> = { 
      name: this.newArtist.name || 'Sin nombre',
      ig: this.newArtist.ig || '',
      bio: this.newArtist.bio || '',
      styles,
      rating: this.newArtist.rating ?? 0,
      photo: this.newArtist.photo || '',
      userId: this.newArtist.userId ?? 0
    };
    this.http.post<Artist>('http://localhost:3000/artists', payload).subscribe({
      next: created => { this.artists.push(created); this.msg='Tatuadora agregada'; this.newArtist={}; this.newArtistStyles=''; setTimeout(()=>this.msg='',1400); },
      error: () => this.msg = 'Error al crear tatuadora'
    });
  }

  getArtistName(id: number): string {
    return this.artists.find(a => a.id === id)?.name || 'Desconocido';
  }

  gotoTurno(turnoId: number) { this.router.navigate(['/perfil'], { queryParams: { tipo: 'turno', id: turnoId } }); }
  gotoArtist(artistId: number) { this.router.navigate(['/perfil'], { queryParams: { tipo: 'artist', id: artistId } }); }
}



