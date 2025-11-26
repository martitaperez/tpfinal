import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private url = 'http://localhost:3000/artists';

  constructor(private http: HttpClient) {}

  // Obtener todos los artistas
  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.url).pipe(
      catchError(err => {
        console.error("Error al obtener artistas:", err);
        return throwError(() => new Error("Error en GET artists"));
      })
    );
  }

  // Obtener artista por su ID real (artist.id)
  getById(id: number | string): Observable<Artist> {
    return this.http.get<Artist>(`${this.url}/${id}`).pipe(
      catchError(err => {
        console.error("Error al obtener artista por ID:", err);
        return throwError(() => new Error("Error en GET artist by id"));
      })
    );
  }

  // Obtener artista por su userId (relación User → Artist)
  getByUserId(userId: number): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.url}?userId=${userId}`).pipe(
      catchError(err => {
        console.error("Error al obtener artista por userId:", err);
        return throwError(() => new Error("Error en GET artist by userId"));
      })
    );
  }

  // Actualizar artista
  updateArtist(id: number | string, patch: Partial<Artist>) {
    return this.http.patch(`${this.url}/${id}`, patch).pipe(
      catchError(err => {
        console.error('Error al actualizar artista:', err);
        return throwError(() => new Error('Error en PATCH artist'));
      })
    );
  }
}
