import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { ArtistService } from '../../services/artist.service';
import { ApiService } from '../../services/api.service';
import { Reserva } from '../../models/reserva.model';
import { Artist } from '../../models/artist.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tatuadoras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tatuadoras.html',
  styleUrls: ['./tatuadoras.css']
})
export class TatuadorasComponent implements OnInit {

  misTurnos: Reserva[] = [];
  artistas: Artist[] = [];
  clientes: any[] = [];

  usuarioActualId!: number;

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
    private artistService: ArtistService,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) return;

    this.usuarioActualId = user.id;

    this.cargarClientes();
    this.cargarArtistas();
    this.cargarTurnos();
  }

  cargarClientes() {
    this.api.getUsuarios().subscribe(users => this.clientes = users);
  }

  cargarArtistas() {
    this.artistService.getAll().subscribe(a => this.artistas = a);
  }

  cargarTurnos() {
    this.turnosService.getAll().subscribe(turnos => {
      this.misTurnos = turnos.filter(t => t.artistId == this.usuarioActualId);
    });
  }

  getNombreCliente(id: number): string {
    const c = this.clientes.find(u => u.id == id);
    return c ? c.name : 'Desconocido';
  }

  traducirEstado(estado: string): string {
    switch (estado) {
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return estado;
    }
  }
  modalConfirmVisible = false;
  modalConfirmText = "";
  modalConfirmAction: (() => void) | null = null;

  abrirConfirmacion(texto: string, accion: () => void) {
    this.modalConfirmText = texto;
    this.modalConfirmAction = accion;
    this.modalConfirmVisible = true;
  }

  confirmar() {
    if (this.modalConfirmAction) this.modalConfirmAction();
    this.modalConfirmVisible = false;
  }

  cancelar() {
    this.modalConfirmVisible = false;
  }

  marcarCompleto(id: string | number) {
    this.turnosService.updateReserva(id, { status: 'completed' })
      .subscribe(() => {
        this.mostrarMensaje("Turno marcado como completado");
        this.cargarTurnos();
      });
  }

  cancelarTurno(id: string | number) {
    this.abrirConfirmacion("¿Cancelar este turno?", () => {
      this.turnosService.updateReserva(id, { status: 'cancelled' })
        .subscribe(() => {
          this.mostrarMensaje("Turno cancelado");
          this.cargarTurnos();
        });
    });
  }

  eliminarTurno(id: string | number) {
    this.abrirConfirmacion("¿Eliminar definitivamente este turno?", () => {
      this.turnosService.eliminarReserva(id)
        .subscribe(() => {
          this.mostrarMensaje("Turno eliminado");
          this.cargarTurnos();
        });
    });

  }

  
  mensaje: string | null = null;

  mostrarMensaje(texto: string) {
    this.mensaje = texto;

    // Ocultar después de 3 segundos
    setTimeout(() => this.mensaje = null, 3000);
  }
}
