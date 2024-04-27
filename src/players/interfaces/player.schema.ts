import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phone: { type: String },
    name: { type: String },
    email: { type: String, unique: true },
    ranking: { type: String },
    positionRanking: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    urlPhoto: { type: String },
  },
  { timestamps: true, collection: 'players' },
);
