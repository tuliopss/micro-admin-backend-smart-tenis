import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from 'src/players/interfaces/player.schema';
import { CategorySchema } from 'src/interfaces/categories/categorySchema.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
