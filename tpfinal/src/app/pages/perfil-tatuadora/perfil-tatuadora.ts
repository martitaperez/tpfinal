import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Artist } from '../../models/artist.model';
import { User } from '../../models/user.model';

import { ArtistService } from '../../services/artist.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-tatuadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-tatuadora.html',
  styleUrls: ['./perfil-tatuadora.css']
})
export class PerfilTatuadoraComponent implements OnInit {

  artista: Artist | null = null;
  usuario: User | null = null;
  turnos: any[] = [];

  constructor(
    private artistService: ArtistService,
    private turnosService: TurnosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = currentUser;

    // cargar artista → usando userId
    this.artistService.getAll().subscribe(arts => {
      this.artista = arts.find(a => a.userId === currentUser.id) ?? null;
    });

    // cargar turnos del artista
    this.turnosService.getAll().subscribe(res => {
      this.turnos = res.filter(t => t.artistId === currentUser.id || t.artistId === this.artista?.id);
    });
  }
}
