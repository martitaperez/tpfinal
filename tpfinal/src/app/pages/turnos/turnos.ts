import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../models/reserva.model';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrls: ['./turnos.css']
})
export class TurnosComponent implements OnInit {

  // ===== CONFIGURACIÓN DE TURNOS =====
  private readonly HORA_INICIO = 8;
  private readonly HORA_FIN = 17;
  private readonly DURACION_TURNO_MIN = 90;

  artists: Artist[] = [];
  reservas: Reserva[] = [];
  horarios: { start: string; end: string }[] = [];
  horariosOcupados: string[] = [];

  artistSeleccionado!: Artist;
  fechaSeleccionada: string = '';

  usuarioActual: any = null;   
  hoy: string = '';

  private ArtistUrl = 'http://localhost:3000/artists';
  private TurnosUrl = 'http://localhost:3000/turnos';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.hoy = this.formatearFecha(new Date());

    // cargar usuario real
    const saved = localStorage.getItem('user');
    if (saved) {
      this.usuarioActual = JSON.parse(saved);
    }

    this.cargarArtists();
  }

  formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const d = fecha.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  cargarArtists() {
    this.http.get<Artist[]>(this.ArtistUrl)
      .subscribe(data => this.artists = data);
  }

  seleccionarTatuador(artist: Artist) {
    this.artistSeleccionado = artist;

    if (this.fechaSeleccionada) {
      this.cargarReservas(artist.id, this.fechaSeleccionada);
    }
  }

  onFechaChange() {
    if (this.artistSeleccionado && this.fechaSeleccionada) {
      this.cargarReservas(this.artistSeleccionado.id, this.fechaSeleccionada);
    }
  }

  generarHorarios(): { start: string; end: string }[] {
    const horarios: { start: string; end: string }[] = [];

    let hora = this.HORA_INICIO;
    let minutos = 0;

    const ahora = new Date();
    const esHoy = this.fechaSeleccionada === this.formatearFecha(ahora);

    while (hora < this.HORA_FIN) {
      const startH = hora.toString().padStart(2, '0');
      const startM = minutos.toString().padStart(2, '0');

      let endHora = hora;
      let endMin = minutos + this.DURACION_TURNO_MIN;

      if (endMin >= 60) {
        endHora += Math.floor(endMin / 60);
        endMin = endMin % 60;
      }

      const endH = endHora.toString().padStart(2, '0');
      const endM = endMin.toString().padStart(2, '0');

      const horario = { start: `${startH}:${startM}`, end: `${endH}:${endM}` };

      if (
        !esHoy ||
        hora > ahora.getHours() ||
        (hora === ahora.getHours() && minutos > ahora.getMinutes())
      ) {
        horarios.push(horario);
      }

      minutos += this.DURACION_TURNO_MIN;
      if (minutos >= 60) {
        hora += Math.floor(minutos / 60);
        minutos = minutos % 60;
      }
    }

    return horarios;
  }

  cargarReservas(artistId: number, fecha: string) {
    this.http.get<Reserva[]>(this.TurnosUrl)
      .subscribe(data => {
        this.reservas = data;
        const reservasDelDia = this.reservas.filter(
          r => r.artistId === artistId && r.date === fecha
        );
        this.horariosOcupados = reservasDelDia.map(r => r.startTime);
        this.horarios = this.generarHorarios();
      });
  }

  reservarTurno(horario: { start: string; end: string }) {
    if (!this.artistSeleccionado || !this.fechaSeleccionada) {
      alert('Selecciona tatuador y fecha primero');
      return;
    }

    const nuevaReserva: Reserva = {
      id: Date.now(),
      artistId: this.artistSeleccionado.id,
      clientId: Number(this.usuarioActual?.id || 0),
      date: this.fechaSeleccionada,
      startTime: horario.start,
      endTime: horario.end,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.http.post(this.TurnosUrl, nuevaReserva)
      .subscribe(() => {
        alert('Reserva creada!');
        this.cargarReservas(this.artistSeleccionado.id, this.fechaSeleccionada);
      });
  }
}
