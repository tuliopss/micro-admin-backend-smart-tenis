import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
      console.log('SERVICE', playerCreated);
      return await playerCreated.save();
    } catch (error) {
      this.logger.error(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getPlayers(): Promise<Player[]> {
    try {
      const players = await this.playerModel.find();

      console.log(players);
      return players;
    } catch (error) {
      this.logger.error(`${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getPlayerById(id: string): Promise<Player> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid IDd`);
    }
    try {
      const player = await this.playerModel.findById(id);

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
    try {
      const playerFound = await this.playerModel.findOne({ _id: id });

      if (!playerFound) {
        throw new BadRequestException('Player not found');
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
    try {
      console.log('to aq no delete');
      await this.playerModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
