import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Artist } from '../../models/artist.model';
import { Reserva } from '../../models/reserva.model';
import { ArtistService } from '../../services/artist.service';
import { TurnosService } from '../../services/turnos.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrls: ['./turnos.css']
})
export class TurnosComponent implements OnInit {

  private readonly HORA_INICIO = 8;
  private readonly HORA_FIN = 17;
  private readonly DURACION_MINUTOS = 90;

  artists: Artist[] = [];
  reservas: Reserva[] = [];

  horarios: { start: string; end: string }[] = [];
  horariosOcupados: string[] = [];

  artistSeleccionado!: Artist | null;
  fechaSeleccionada: string = '';
  hoy: string = '';

  constructor(
    private artistService: ArtistService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.hoy = this.formatearFecha(new Date());
    this.cargarArtists();
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  private formatearHora(hora: string): string {
    const [h, m] = hora.split(':');
    return `${h.padStart(2,'0')}:${m.padStart(2,'0')}`;
  }

  private horaIgual(hora1: string, hora2: string): boolean {
    const [h1, m1] = hora1.split(':').map(Number);
    const [h2, m2] = hora2.split(':').map(Number);
    return h1 === h2 && m1 === m2;
  }

  cargarArtists() {
    this.artistService.getAll().subscribe({
      next: data => this.artists = data,
      error: err => {
        console.error('Error cargando artistas', err);
        alert('No se pudieron cargar los artistas.');
      }
    });
  }

  seleccionarTatuador(artist: Artist) {
    this.artistSeleccionado = artist;
    if (this.fechaSeleccionada) this.cargarReservas();
  }

  seleccionarFecha() {
    if (this.artistSeleccionado) this.cargarReservas();
  }

  cargarReservas() {
    if (!this.artistSeleccionado || !this.fechaSeleccionada) return;

    this.turnosService.getAll().subscribe({
      next: data => {
        this.reservas = data;

        const reservasDelDia = this.reservas.filter(r => {
          const fechaReserva = r.date.split('T')[0];
          return r.artistId === this.artistSeleccionado!.id.toString() &&
                 fechaReserva === this.fechaSeleccionada;
        });

        this.horariosOcupados = reservasDelDia.map(r => this.formatearHora(r.startTime));
        this.horarios = this.generarHorarios();
      },
      error: err => {
        console.error('Error cargando reservas', err);
        alert('No se pudieron cargar los turnos.');
      }
    });
  }

  generarHorarios(): { start: string; end: string }[] {
    const horarios: { start: string; end: string }[] = [];
    let hora = this.HORA_INICIO;
    let minutos = 0;

    const ahora = new Date();
    const esHoy = this.fechaSeleccionada === this.formatearFecha(ahora);

    while (hora < this.HORA_FIN) {
      const start = `${hora.toString().padStart(2,'0')}:${minutos.toString().padStart(2,'0')}`;

      let endHora = hora;
      let endMin = minutos + this.DURACION_MINUTOS;
      if (endMin >= 60) {
        endHora += Math.floor(endMin / 60);
        endMin = endMin % 60;
      }
      const end = `${endHora.toString().padStart(2,'0')}:${endMin.toString().padStart(2,'0')}`;

      if (!esHoy || start > ahora.toTimeString().slice(0,5)) {
        horarios.push({ start, end });
      }

      minutos += this.DURACION_MINUTOS;
      if (minutos >= 60) {
        hora += Math.floor(minutos / 60);
        minutos = minutos % 60;
      }
    }

    return horarios;
  }

  reservarTurno(horario: { start: string; end: string }) {
    if (!this.artistSeleccionado || !this.fechaSeleccionada) {
      alert('Seleccioná tatuador y fecha primero');
      return;
    }

    const fecha = new Date(this.fechaSeleccionada);
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    if (fecha < hoy) {
      alert('No podés reservar en una fecha pasada.');
      return;
    }

    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      artistId: this.artistSeleccionado.id.toString(),
      clientId: "1",
      date: this.fechaSeleccionada,
      startTime: horario.start,
      endTime: horario.end,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.turnosService.crearReserva(nuevaReserva).subscribe({
      next: () => {
        alert('Reserva creada!');
        this.cargarReservas();
      },
      error: err => {
        console.error('Error creando reserva', err);
        alert('No se pudo crear el turno.');
      }
    });
  }

  cancelarTurno(horario: { start: string; end: string }) {
    if (!this.artistSeleccionado || !this.fechaSeleccionada) return;

    const reserva = this.reservas.find(r => {
      const fechaReserva = r.date.split('T')[0];
      return r.artistId === this.artistSeleccionado!.id.toString() &&
             fechaReserva === this.fechaSeleccionada &&
             this.horaIgual(r.startTime, horario.start);
    });

    if (!reserva) {
      alert("No se encontró la reserva para cancelar.");
      return;
    }

    this.turnosService.eliminarReserva(reserva.id).subscribe({
      next: () => {
        alert("Turno cancelado correctamente.");
        this.cargarReservas();
      },
      error: err => {
        console.error("Error cancelando turno:", err);
        alert("No se pudo cancelar el turno.");
      }
    });
  }
}
