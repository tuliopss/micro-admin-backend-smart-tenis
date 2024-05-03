import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { CategorySchema } from './categories/interfaces/categorySchema.schema';
import { PlayerSchema } from './players/interfaces/player.schema';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/srtadmbackend'),
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Player', schema: PlayerSchema },
    ]),
    CategoriesModule,
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
