import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { ZodError } from 'zod';
import { RedisClientType } from 'redis';

import { PenaltyGameService } from '../penalty.service';
import { MakePenaltyMoveSchema } from '../schema/penalty.schema';
import { PENALTY_EVENTS } from 'src/events/penalty.events';
import { REDIS_CLIENT } from 'src/redis/redis.provider';
import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AsyncApi, AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';

type PlayerPresence = { isConnected: boolean };

class GameIdRequestDto {
  @ApiProperty()
  gameId: string;
}

class InitGameRequestDto {
  @ApiProperty({
    example: 'game-uuid'
  })
  gameId: string;

  @ApiProperty()
  shooter: { id: string; username: string; firstName?: string; lastName?: string };

  @ApiProperty({
    example: { id: 'user2', username: 'keeper1' },
  })
  goalkeeper: { id: string; username: string; firstName?: string; lastName?: string };
}

// Note: We don't need full Zod alignment — just enough for docs
class MakeMoveRequestDto {
  @ApiProperty({ example: 'game_123' })
  gameId: string;

  @ApiProperty({ example: 'player_123' })
  playerId: string;

  @ApiProperty({ enum: ['left', 'center', 'right'], example: 'left' })
  direction: string;
}

class SocketResponseDto<T = any> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;
}

// Presence broadcast payload
class PresencePayloadDto {
  @ApiProperty()
  gameId: string;

  @ApiProperty({
    type: 'object',
    properties: {
      isConnected: { type: 'boolean' },
    },

  })
  playerStatuses: Record<string, { isConnected: boolean }>;
}

// Game state (minimal — matches what you emit)
class PenaltyGameStateDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['PENDING', 'ACTIVE', 'FINISHED'] })
  status: string;

  @ApiProperty({ nullable: true })
  winnerId?: string;

  @ApiProperty()
  shooterId: string;

  @ApiProperty()
  goalkeeperId: string;

}

@AsyncApi()
@WebSocketGateway({
  namespace: '/penalty',
  cors: { origin: '*' },
})
export class PenaltyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(PenaltyGateway.name);

  constructor(
    private readonly penaltyGameService: PenaltyGameService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
  ) {
    this.logger.log('✅ PenaltyGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Penalty Client Connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`Penalty Client Disconnected: ${client.id}`);
    const { user, gameId } = client.data;
    if (!user?.id || !gameId) return;

    const key = this.getPresenceKey(gameId);
    const current = await this.redis.hGet(key, user.id);
    if (current) {
      const status = JSON.parse(current) as PlayerPresence;
      status.isConnected = false;
      await this.redis.hSet(key, user.id, JSON.stringify(status));
      await this.broadcastPresence(gameId);
    }
  }

  private getRoom(gameId: string) {
    return `penalty:${gameId}`;
  }

  private getPresenceKey(gameId: string) {
    return `penalty:presence:${gameId}`;
  }

  // 🔹 Documented broadcast
  @AsyncApiPub({
    channel: PENALTY_EVENTS.PRESENCE,
    message: {
      name: 'PenaltyPresenceEvent',
      payload: SocketResponseDto<PresencePayloadDto>,
    },
    summary: 'Player presence update in penalty game',
    description: 'Broadcast to all players in the room when someone joins, leaves, or disconnects.',
    tags: [{ name: 'Penalty Game', description: 'Real-time penalty shootout gameplay.' }],
  })
  private async broadcastPresence(gameId: string) {
    const key = this.getPresenceKey(gameId);
    const raw = await this.redis.hGetAll(key);

    const playerStatuses: Record<string, PlayerPresence> = {};
    for (const [playerId, value] of Object.entries(raw)) {
      try {
        playerStatuses[playerId] = JSON.parse(value);
      } catch {
        this.logger.warn(`Invalid presence data for ${playerId}`);
      }
    }

    this.server.to(this.getRoom(gameId)).emit(
      PENALTY_EVENTS.PRESENCE,
      this.socketResponse('Presence updated', { gameId, playerStatuses }),
    );
  }

  private socketResponse<T>(message: string, data: T) {
    return { message, data };
  }

  @SubscribeMessage(PENALTY_EVENTS.JOIN_GAME)
  @AsyncApiSub({
    channel: PENALTY_EVENTS.JOIN_GAME,
    message: {
      name: 'JoinPenaltyGameRequest',
      payload: GameIdRequestDto,
    },
    summary: 'Join a penalty game room',
    description: 'Client joins the game room and appears in presence list.',
    tags: [{ name: 'Penalty Game' }],
  })
  @AsyncApiPub({
    channel: PENALTY_EVENTS.JOINED,
    message: {
      name: 'JoinedPenaltyGameEvent',
      payload: SocketResponseDto<{ gameId: string; userId: string }>,
    },
    summary: 'Successfully joined penalty game',
    description: 'Sent only to the joining client.',
    tags: [{ name: 'Penalty Game' }],
  })
  async handleJoinGame(
    @MessageBody() { gameId }: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user?.id;
    if (!userId) throw new BadRequestException('User not authenticated');

    const game = await this.penaltyGameService.getGame(gameId);
    if (!game) throw new NotFoundException('Game not found');

    const room = this.getRoom(gameId);
    client.join(room);
    client.data.gameId = gameId;

    const key = this.getPresenceKey(gameId);
    await this.redis.hSet(
      key,
      userId,
      JSON.stringify({ isConnected: true }),
    );
    await this.redis.expire(key, 3600);

    await this.broadcastPresence(gameId);

    this.logger.debug(`User ${userId} joined penalty game room: ${room}`);
    client.emit(
      PENALTY_EVENTS.JOINED,
      this.socketResponse('Joined game successfully', { gameId, userId }),
    );
  }

  @SubscribeMessage(PENALTY_EVENTS.LEAVE_GAME)
  @AsyncApiSub({
    channel: PENALTY_EVENTS.LEAVE_GAME,
    message: {
      name: 'LeavePenaltyGameRequest',
      payload: GameIdRequestDto,
    },
    summary: 'Leave a penalty game room',
    description: 'Client leaves the room and is removed from presence.',
    tags: [{ name: 'Penalty Game' }],
  })
  @AsyncApiPub({
    channel: PENALTY_EVENTS.LEFT,
    message: {
      name: 'LeftPenaltyGameEvent',
      payload: SocketResponseDto<{ gameId: string; userId: string }>,
    },
    summary: 'Successfully left penalty game',
    description: 'Sent only to the leaving client.',
    tags: [{ name: 'Penalty Game' }],
  })
  async handleLeaveGame(
    @MessageBody() { gameId }: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user?.id;
    if (!userId) throw new BadRequestException('User not authenticated');

    const key = this.getPresenceKey(gameId);
    await this.redis.hDel(key, userId);
    await this.broadcastPresence(gameId);

    client.leave(this.getRoom(gameId));
    delete client.data.gameId;

    this.logger.debug(`User ${userId} left penalty game room: ${gameId}`);
    client.emit(
      PENALTY_EVENTS.LEFT,
      this.socketResponse('Left game successfully', { gameId, userId }),
    );
  }

  @SubscribeMessage(PENALTY_EVENTS.INIT)
  @AsyncApiSub({
    channel: PENALTY_EVENTS.INIT,
    message: {
      name: 'InitPenaltyGameRequest',
      payload: InitGameRequestDto,
    },
    summary: 'Initialize penalty game roles',
    description: 'Assign shooter and goalkeeper to start the match.',
    tags: [{ name: 'Penalty Game' }],
  })
  @AsyncApiPub({
    channel: PENALTY_EVENTS.GAME_INIT,
    message: {
      name: 'PenaltyGameInitializedEvent',
      payload: SocketResponseDto<PenaltyGameStateDto>,
    },
    summary: 'Penalty game initialized',
    description: 'Broadcast to all room members when roles are set.',
    tags: [{ name: 'Penalty Game' }],
  })
  async handleInitGame(
    @MessageBody() { gameId, shooter, goalkeeper }: { gameId: string; shooter: User; goalkeeper: User },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const game = await this.penaltyGameService.getGame(gameId);
      if (!game) throw new NotFoundException('Game not found');

      this.logger.debug("\n\n\n", { shooter, goalkeeper })
      const updatedGame = await this.penaltyGameService.initGame(gameId, shooter.id, goalkeeper.id);

      this.server.to(this.getRoom(gameId)).emit(
        PENALTY_EVENTS.GAME_INIT,
        this.socketResponse('Game initialized', updatedGame),
      );
    } catch (error: any) {
      client.emit(
        PENALTY_EVENTS.ERROR,
        this.socketResponse('Game init failed', { error: error.message }),
      );
    }
  }

  @SubscribeMessage(PENALTY_EVENTS.MAKE_MOVE)
  @AsyncApiSub({
    channel: PENALTY_EVENTS.MAKE_MOVE,
    message: {
      name: 'MakePenaltyMoveRequest',
      payload: MakeMoveRequestDto,
    },
    summary: 'Submit a penalty move',
    description: 'Player sends their chosen direction (e.g., LEFT, CENTER).',
    tags: [{ name: 'Penalty Game' }],
  })
  @AsyncApiPub({
    channel: PENALTY_EVENTS.GAME_UPDATE,
    message: {
      name: 'PenaltyGameUpdatedEvent',
      payload: SocketResponseDto<PenaltyGameStateDto>,
    },
    summary: 'Penalty game state updated',
    description: 'Sent after a valid move is processed.',
    tags: [{ name: 'Penalty Game' }],
  })

  @AsyncApiPub({
    channel: PENALTY_EVENTS.GAME_FINISHED,
    message: {
      name: 'PenaltyGameFinishedEvent',
      payload: SocketResponseDto<PenaltyGameStateDto>,
    },
    summary: 'Penalty game finished',
    description: 'Broadcast when the game ends and a winner is determined.',
    tags: [{ name: 'Penalty Game' }],
  })

  async handleMakeMove(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user?.id;
      if (!userId) throw new BadRequestException('User not authenticated');

      const dto = MakePenaltyMoveSchema.parse({ ...data, playerId: userId });
      const updatedGame = await this.penaltyGameService.makeMove(dto);

      this.server.to(this.getRoom(dto.gameId)).emit(
        PENALTY_EVENTS.GAME_UPDATE,
        this.socketResponse('Game updated', updatedGame),
      );

      if (updatedGame.status === 'FINISHED' && updatedGame.winnerId) {
        this.server.to(this.getRoom(dto.gameId)).emit(
          PENALTY_EVENTS.GAME_FINISHED,
          this.socketResponse('Game finished', updatedGame),
        );
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        client.emit(
          PENALTY_EVENTS.ERROR,
          this.socketResponse('Validation failed', { errors: error.issues }),
        );
      } else {
        client.emit(
          PENALTY_EVENTS.ERROR,
          this.socketResponse('Move failed', { error: error.message }),
        );
        this.logger.error('Penalty move error:', error);
      }
    }
  }
}
