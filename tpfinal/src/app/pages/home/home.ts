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
  artistaSeleccionada: Artist | null = null;

  constructor(
    private artistService: ArtistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.artistService.getAll().subscribe(a => {
      this.artistas = a;
    });
  }

  verMas(artist: Artist) {
    this.artistaSeleccionada = artist;
  }

  cerrarDetalle() {
    this.artistaSeleccionada = null;
  }

  irAReservar() {
    this.router.navigate(['/turnos']);
  }
}