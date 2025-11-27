import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist.model';
import { AuthService } from '../../services/auth.service';



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

  
  modalAbierto = false;

  constructor(
    private artistService: ArtistService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.artistService.getAll().subscribe(a => {
      this.artistas = a;
    });
  }

  
  abrirTatuadoras() {
    this.modalAbierto = true;
  }

  
  cerrarTatuadoras() {
    this.modalAbierto = false;
    this.artistaSeleccionada = null; 
  }

 
  verMas(artist: Artist) {
    this.artistaSeleccionada = artist;
  }

  
  cerrarDetalle() {
    this.artistaSeleccionada = null;
  }

  
 irAReservar() {
  const user = this.auth.getUser();
  console.log("USER:", user);

  if (!user) {
    console.log("NO LOGUEADO → IR A LOGIN");
    this.router.navigate(['/login']);
    return;   // 🔥 IMPORTANTE: si no ponés return, sigue hacia turnos
  }

  console.log("LOGUEADO → IR A TURNOS");
  this.router.navigate(['/turnos']);
}

}