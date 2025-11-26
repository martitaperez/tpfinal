export interface User {
  id: number;
  name: string;
  apellido: string;
  email: string;
  role: 'client' | 'admin' | 'artist';
  phone: string;
 
}