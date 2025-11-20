import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../models/reserva.model';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  reservas: Reserva[] = [];
  artists: Artist[] = [];
  loading = true;

  private turnosUrl = 'http://localhost:3001/turnos';
  private artistsUrl = 'http://localhost:3001/artists';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;

    this.http.get<Reserva[]>(this.turnosUrl).subscribe(turnos => {
      this.reservas = turnos;

      this.http.get<Artist[]>(this.artistsUrl).subscribe(arts => {
        this.artists = arts;
        this.loading = false;
      });
    });
  }

  getArtistName(id: number): string {
    return this.artists.find(a => a.id === id)?.name || 'Desconocido';
  }

  borrarTurno(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este turno?')) return;

    this.http.delete(`${this.turnosUrl}/${id}`).subscribe(() => {
      this.reservas = this.reservas.filter(r => r.id !== id);
    });
  }
}
