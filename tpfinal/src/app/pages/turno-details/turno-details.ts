import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnosService } from '../../services/turnos.service';
import { Reserva } from '../../models/reserva.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-turno-details',
  templateUrl: './turno-details.html',
  styleUrls: ['./turno-details.css']
})
export class TurnoDetailComponent implements OnInit {

  reserva: Reserva | null = null;
  descripcionEditable: string = '';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('Id de reserva inválido');
      this.router.navigate(['/tatuadora']);
      return;
    }

    this.turnosService.getById(id).subscribe({
      next: data => {
        this.reserva = data;
        this.descripcionEditable = data.description || '';
        this.cargando = false;
      },
      error: err => {
        console.error('Error trayendo la reserva:', err);
        alert('No se pudo obtener la reserva');
        this.router.navigate(['/tatuadora']);
      }
    });
  }

  // Guardar (patch) sólo la descripción del cliente o la nota de la artista
  guardarDescripcion() {
    if (!this.reserva) return;
    const payload: Partial<Reserva> = {
      description: this.descripcionEditable,
      updatedAt: new Date().toISOString()
    };

    this.turnosService.updateReserva(this.reserva.id, payload).subscribe({
      next: () => {
        alert('Descripción guardada');
        // actualizar la vista recargando la reserva
        this.turnosService.getById(this.reserva!.id).subscribe(r => {
          this.reserva = r;
          this.descripcionEditable = r.description || '';
        });
      },
      error: err => {
        console.error('Error guardando descripción:', err);
        alert('No se pudo guardar la descripción');
      }
    });
  }

  cancelarTurno() {
    if (!this.reserva) return;
    if (!confirm('¿Confirmás cancelar esta reserva?')) return;

    this.turnosService.eliminarReserva(this.reserva.id.toString()).subscribe({
      next: () => {
        alert('Reserva cancelada');
        this.router.navigate(['/tatuadora']);
      },
      error: err => {
        console.error('Error cancelando reserva:', err);
        alert('No se pudo cancelar la reserva');
      }
    });
  }

  volver() {
    this.router.navigate(['/tatuadora']);
  }
}