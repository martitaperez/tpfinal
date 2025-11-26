export interface User {
  id: number;
  name: string;
  apellido?: string; // opcional
  email: string;
  password: string;
  role: 'client' | 'admin' | 'artist';
  phone?: string; // opcional
}
