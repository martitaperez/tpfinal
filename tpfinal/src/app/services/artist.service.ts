import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private url = 'http://localhost:3001/artists';

  constructor(private http: HttpClient) {}

  // Obtener todos los artistas
  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.url).pipe(
      catchError(err => {
        console.error("❌ Error al obtener artistas:", err);
        return throwError(() => new Error("Error en GET artists"));
      })
    );
  }
}
