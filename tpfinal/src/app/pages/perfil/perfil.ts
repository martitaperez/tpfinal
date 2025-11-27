import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { TurnosService } from '../../services/turnos.service';
import { User } from '../../models/user.model';
import { Artist } from '../../models/artist.model';
import { Reserva } from '../../models/reserva.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  tipo: 'admin' | 'artist' | 'turno' = 'admin';
  id!: number;

  user: User | null = null;
  artist: Artist | null = null;
  reserva: Reserva | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private artistService: ArtistService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.tipo = params['tipo'];
      this.id = +params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos() {
    if (this.tipo === 'admin') {
      this.userService.getById(this.id).subscribe(u => this.user = u);
    } else if (this.tipo === 'artist') {
      this.artistService.getById(this.id).subscribe(a => this.artist = a);
    } else if (this.tipo === 'turno') {
      this.turnosService.getById(this.id).subscribe(r => this.reserva = r);
    }
  }

  guardarCambios() {
    if (this.tipo === 'admin' && this.user) {
      this.userService.updateUser(this.user.id, this.user).subscribe(() => alert('Admin actualizado'));
    } else if (this.tipo === 'artist' && this.artist) {
      this.artistService.updateArtist(this.artist.id, this.artist).subscribe(() => alert('Artista actualizado'));
    } else if (this.tipo === 'turno' && this.reserva) {
      this.turnosService.updateReserva(this.reserva.id, this.reserva).subscribe(() => alert('Turno actualizado'));
    }
  }
}
