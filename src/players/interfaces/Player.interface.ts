import { Document } from 'mongoose';
import { Category } from 'src/interfaces/categories/categories.interface';

export interface Player extends Document {
  readonly phone: string;
  readonly email: string;
  category: Category;
  name: string;
  ranking: string;
  posicaoRanking: number;
  urlPhoto: string;
}
