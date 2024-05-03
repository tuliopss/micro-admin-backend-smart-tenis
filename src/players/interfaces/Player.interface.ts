import { Category } from 'src/categories/interfaces/categories.interface';
import { Document } from 'mongoose';

export interface Player extends Document {
  readonly phone: string;
  readonly email: string;
  category: Category;
  name: string;
  ranking: string;
  positionRanking: number;
  urlPlayerPhoto: string;
}
