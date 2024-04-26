import { CategoriesService } from './categories.service';
import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
// import { AppService } from '../app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from '../interfaces/categories/categories.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}
  private logger = new Logger(CategoryController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log('category: ', JSON.stringify(category));

    try {
      await this.categoriesService.createCategory(category);

      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      ackErrors.map(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Ctx() context: RmqContext): Promise<Category[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.categoriesService.getCategories();
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('get-categories-by-id')
  async getCategoriesById(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.categoriesService.getCategoriesById(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data>`, JSON.stringify(data));

    const id = data.id;
    const category: Category = data.category;

    try {
      await this.categoriesService.updateCategory(id, category);
      await channel.ack(originalMsg);
    } catch (error) {
      ackErrors.map(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }
}
