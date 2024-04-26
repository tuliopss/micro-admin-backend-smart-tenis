import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Player } from './interfaces/Player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private logger = new Logger(PlayersService.name);

  async createPlayer(player: Player): Promise<Player> {
    const playerCreated = new this.playerModel(player);

    try {
      return await playerCreated.save();
    } catch (error) {
      this.logger.error(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getPlayers(): Promise<Player[]> {
    try {
      return await this.playerModel.find();
    } catch (error) {
      this.logger.error(`${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getPlayerById(id: string): Promise<Player> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID`);
    }
    try {
      const player = await this.playerModel
        .findById(id)
        .populate([{ path: 'categories', model: 'category' }]);
      if (!player) {
        throw new NotFoundException(`Player not Found`);
      }

      return player;
    } catch (error) {
      this.logger.error(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updatePlayer(id: string, player: Player): Promise<Player> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID`);
    }
    try {
      const playerFound = await this.playerModel.findById(id);

      if (!playerFound) {
        throw new NotFoundException(`Player not Found`);
      }

      return await this.playerModel.findOneAndUpdate(
        { _id: id },
        { $set: player },
      );
    } catch (error) {
      this.logger.error(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletePlayer(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID`);
    }
    try {
      const playerFound = await this.playerModel.findById(id);

      if (!playerFound) {
        throw new NotFoundException(`Player not Found`);
      }

      await this.playerModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
