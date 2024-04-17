import { Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Category } from './interfaces/categories/categories.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private logger = new Logger(AppService.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log('category: ', JSON.stringify(category));
    await this.appService.createCategory(category);
  }

  @MessagePattern('get-categories')
  async getCategories(): Promise<Category[]> {
    return await this.appService.getCategories();
  }
}
