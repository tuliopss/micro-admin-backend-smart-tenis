import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { CategoriesModule } from './interfaces/categories/categories.module';
// import { PlayersModule } from './interfaces/players/players.module';
// import { CategorySchema } from './interfaces/categories/interfaces/categorySchema.schema';
import { PlayerSchema } from './interfaces/players/interfaces/player.schema';
import { CategorySchema } from './interfaces/categories/categorySchema.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/srtadmbackend'),
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Player', schema: PlayerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
