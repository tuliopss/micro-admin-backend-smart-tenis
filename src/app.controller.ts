import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from './interfaces/categories/categories.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private logger = new Logger(AppService.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log('category: ', JSON.stringify(category));

    try {
      await this.appService.createCategory(category);

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
  async getCategories(): Promise<Category[]> {
    return await this.appService.getCategories();
  }

  @MessagePattern('get-categories-by-id')
  async getCategoriesById(@Payload() id: string): Promise<Category> {
    return await this.appService.getCategoriesById(id);
  }
}
