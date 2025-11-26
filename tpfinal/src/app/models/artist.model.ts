export interface Artist {
  id: number;          // id del artista
  userId: number;      // FK → usuario dueño del perfil
  name: string;
  ig: string;
  bio: string;
  styles: string[];
  rating: number;
  photo: string;
}
