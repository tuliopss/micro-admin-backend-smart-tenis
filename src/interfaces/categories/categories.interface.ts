import { Document } from 'mongoose';
// import { Player } from 'src/players/interfaces/Player.interface';

export interface Category extends Document {
  category: string;

  description: string;
  events: Array<Evento>;
}

export interface Evento {
  name: string;
  operation: string;
  value: number;
}
