import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Reserva } from '../../models/reserva.model';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './turnos.html',
  styleUrls: ['./turnos.css']
})
export class TurnosComponent implements OnInit {

  artists: Artist[] = [];                
  reservas: Reserva[] = [];              
  horarios: {start: string, end: string}[] = [];  
  horariosOcupados: string[] = [];       
  artistSeleccionado!: Artist;           
  fechaSeleccionada: string = '';        
  usuarioActual: string = 'Rodrigo';     

  hoy: string = '';  // para limitar fechas pasadas

  private ArtistUrl = 'http://localhost:3001/artists'; 
  private TurnosUrl = 'http://localhost:3001/turnos'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.hoy = this.formatearFecha(new Date());
    this.cargarArtists();
  }

  // Helper para formatear fechas YYYY-MM-DD
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

  seleccionarFecha(event: any) {
    this.fechaSeleccionada = event.target.value;
    if (this.artistSeleccionado) {
      this.cargarReservas(this.artistSeleccionado.id, this.fechaSeleccionada);
    }
  }

  // Generar horarios de 1h30 considerando hora actual si es hoy
  generarHorarios(): {start: string, end: string}[] {
    const horarios: {start: string, end: string}[] = [];
    let hora = 8;
    let minutos = 0;

    const ahora = new Date();
    const esHoy = this.fechaSeleccionada === this.formatearFecha(ahora);

    while (hora < 17) {
      const startH = hora.toString().padStart(2, '0');
      const startM = minutos.toString().padStart(2, '0');

      let endHora = hora + 1;
      let endMin = minutos + 30;
      if (endMin >= 60) {
        endHora += Math.floor(endMin / 60);
        endMin = endMin % 60;
      }
      const endH = endHora.toString().padStart(2, '0');
      const endM = endMin.toString().padStart(2, '0');

      const horario = { start: `${startH}:${startM}`, end: `${endH}:${endM}` };

      // Si es hoy, ignorar horarios pasados
      if (!esHoy || (hora > ahora.getHours() || (hora === ahora.getHours() && minutos > ahora.getMinutes()))) {
        horarios.push(horario);
      }

      minutos += 90;
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
        const reservasDelDia = this.reservas.filter(r => r.artistId === artistId && r.date === fecha);
        this.horariosOcupados = reservasDelDia.map(r => r.startTime);
        this.horarios = this.generarHorarios();
      });
  }

  reservarTurno(horario: {start: string, end: string}) {
    if (!this.artistSeleccionado || !this.fechaSeleccionada) {
      alert('Selecciona tatuador y fecha primero');
      return;
    }

    const nuevaReserva: Reserva = {
      id: Date.now(),
      artistId: this.artistSeleccionado.id,
      clientId: 1, 
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
