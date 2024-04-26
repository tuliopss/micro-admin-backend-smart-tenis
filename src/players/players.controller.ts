import { Controller, Logger } from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './interfaces/Player.interface';

const ackErrors: string[] = ['E11000'];

@Controller('api/v1')
export class PlayersController {
  logger = new Logger(PlayersController.name);
  constructor(private readonly playerService: PlayersService) {}

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.playerService.createPlayer(player);
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

  @MessagePattern('get-players')
  async getPlayers(@Ctx() context: RmqContext): Promise<Player[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.playerService.getPlayers();
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('get-players-by-id')
  async getCategoriesById(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.playerService.getPlayerById(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
