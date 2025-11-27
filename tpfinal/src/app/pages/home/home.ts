import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  artistas: Artist[] = [];
  
  // 🔥 Tus variables reales:
  artistaSeleccionada: Artist | null = null;

  // 🔥 Variable para el modal principal:
  modalAbierto = false;

  constructor(
    private artistService: ArtistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.artistService.getAll().subscribe(a => {
      this.artistas = a;
    });
  }

  // 🔥 Abrir lista de tatuadoras (primer modal)
  abrirTatuadoras() {
    this.modalAbierto = true;
  }

  // 🔥 Cerrar lista de tatuadoras
  cerrarTatuadoras() {
    this.modalAbierto = false;
    this.artistaSeleccionada = null; // Cierra también el detalle
  }

  // 🔥 Abrir detalle de una tatuadora
  verMas(artist: Artist) {
    this.artistaSeleccionada = artist;
  }

  // 🔥 Cerrar detalle de tatuadora
  cerrarDetalle() {
    this.artistaSeleccionada = null;
  }

  // 🔥 Redireccionar a turnos
  irAReservar() {
    this.router.navigate(['/turnos']);
  }
}