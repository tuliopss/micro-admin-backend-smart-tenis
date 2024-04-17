import { Document } from 'mongoose';

export interface Player extends Document {
  readonly phone: string;
  name: string;
  readonly email: string;
  ranking: string;
  posicaoRanking: number;
  urlPhoto: string;
}
