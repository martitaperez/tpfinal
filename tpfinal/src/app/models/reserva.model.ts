export interface Reserva {
  id: string;
  clientId: string;
  artistId: string;
  date: string;        
  startTime: string;   // '14:00'
  endTime: string;     // '15:30'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  description?: string;
  referenceImages?: string[]; 
  createdAt?: string;
  updatedAt?: string;
}