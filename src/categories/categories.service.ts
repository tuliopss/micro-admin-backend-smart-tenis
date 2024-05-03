import { Category } from 'src/categories/interfaces/categories.interface';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    // @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private logger = new Logger(CategoriesService.name);

  async createCategory(category: Category): Promise<Category> {
    try {
      const categoryCreated = new this.categoryModel(category);
      return await categoryCreated.save();
    } catch (error) {
      this.logger.error(`${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find();
    } catch (error) {
      this.logger.error(`${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getCategoriesById(id: string): Promise<Category> {
    try {
      // console.log(id);
      const category = await this.categoryModel.findById(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      this.logger.error(`${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(id: string, category: Category): Promise<Category> {
    const categoryFound = await this.categoryModel.findById(id);

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    try {
      return await this.categoryModel.findOneAndUpdate(
        { _id: id },
        { $set: category },
      );
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
