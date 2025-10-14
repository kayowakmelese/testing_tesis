import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { DefaultEventsMap, RemoteSocket, Server, Socket } from 'socket.io';
import { ZodError } from 'zod';
import {
  BadRequestException,
  HttpException,
  Inject,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';


import { REDIS_CLIENT } from 'src/redis/redis.provider';
import { RedisClientType } from 'redis';
import { PlayerPresenceStatus, PlayersPressenceStatus } from 'src/types';
import { GAME_TYPE, GameInvite, User } from '@prisma/client';
import {
  GAME_INVITE_EVENTS,
  GAME_INVITE_ROOM_EVENTS,
} from 'src/events/game-invite.events';
import { AsyncApi, AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { ApiProperty } from '@nestjs/swagger';
import { GameInviteService } from 'src/game-invite/game-invite.service';
import { AcceptGameInviteDto, AcceptGameInviteSchema, CreateGameInviteDto, CreateGameInviteSchema } from 'src/game-invite/schema/game-invite.schema';

// ======================
// DTOs for AsyncAPI
// ======================

class GameInviteDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fromUserId: string;
  @ApiProperty({ enum: Object.values(GAME_TYPE) })
  gameType: GAME_TYPE;
  @ApiProperty()
  toUsers: UserDto[];
  @ApiProperty({ nullable: true })
  game?: { id: string; status: string; startedAt?: Date };
}

class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty({ required: false })
  firstName?: string;
  @ApiProperty({ required: false })
  lastName?: string;
}

class EmptyPayloadDto {}

class GameInviteIdDto {
  @ApiProperty()
  gameInviteId: string;
}

class GameInviteResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: any; // Could be refined per event, but kept generic for brevity
}

class PlayerPresenceDto {
  @ApiProperty()
  isConnected: boolean;
  @ApiProperty()
  isReady: boolean;
}

class GameInviteRoomPresenceDto {
  @ApiProperty()
  gameInviteId: string;
  @ApiProperty()
  playerStatuses: PlayersPressenceStatus;
}

// ======================
// Gateway with AsyncAPI
// ======================

@AsyncApi()
@WebSocketGateway({
  namespace: '/game-invite',
  cors: { origin: '*' },
})
export class GameInviteGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GameInviteGateway.name);

  constructor(
    private gameInviteService: GameInviteService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
  ) {
    this.logger.log('✅ GameInviteGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client Connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user = this.verifyUser(client);
    const gameInviteId = client.data.gameInviteId;
    const userId = user.id;

    if (userId && gameInviteId) {
      const key = this.getGameInviteRoomPresenceKey(gameInviteId);
      try {
        const current = await this.redis.hGet(key, userId);
        if (current) {
          const status = JSON.parse(current) as PlayerPresenceStatus;
          status.isConnected = false;

          await this.redis.hSet(key, userId, JSON.stringify(status));
        }

        await this.broadcastGameInviteRoomPresence(gameInviteId);
      } catch (error) {
        this.logger.error('Error updating presence on disconnect:', error);
      }
    }
  }

  private getGameInviteRoomPresenceKey(gameInviteId: string): string {
    return `game-invite:presence:${gameInviteId}`;
  }

  private getGameInviteRoomChannel(gameInviteId: string) {
    return `game-invite:${gameInviteId}`;
  }

  private verifyUser(client: Socket) {
    const user = client.data.user as User;
    if (!user) throw new Error('Unauthorized');
    return user;
  }

  private async getLiveSocketFromServer(userId: string) {
    const sockets = await this.server.fetchSockets();
    return sockets.find((s) => s.data.user?.id === userId);
  }

  private async getInvitedUsersSocket(invite: GameInvite & { toUsers: User[] }) {
    const sockets = await this.server.fetchSockets();
    return sockets.filter((s) =>
      s.data.user?.id && invite.toUsers.map((u) => u.id).includes(s.data.user.id),
    );
  }

  private socketResponse(message: string, data: any): GameInviteResponseDto {
    return { message, data };
  }

  @AsyncApiPub({
    channel: GAME_INVITE_ROOM_EVENTS.PRESENCE,
    message: {
      name: 'GameInviteRoomPresenceEvent',
      payload: GameInviteRoomPresenceDto,
    },
    summary: 'Broadcasts player presence in a game invite room',
    description: 'Sent to all clients in the room when presence changes (join, leave, ready).',
    tags: [{ name: 'Game Invites', description: 'Real-time game invitation and room management.' }],
  })
  private async broadcastGameInviteRoomPresence(gameInviteId: string) {
    const key = this.getGameInviteRoomPresenceKey(gameInviteId);
    const rawData = await this.redis.hGetAll(key);

    const playerStatuses: PlayersPressenceStatus = {};
    for (const [userId, playerPresenceStatus] of Object.entries(rawData)) {
      try {
        playerStatuses[userId] = JSON.parse(playerPresenceStatus as string);
      } catch (e) {
        this.logger.warn('Error on `broadcastGameInviteRoomPresence`', e);
      }
    }

    const room = this.getGameInviteRoomChannel(gameInviteId);
    this.server.to(room).emit(
      GAME_INVITE_ROOM_EVENTS.PRESENCE,
      this.socketResponse('', {
        gameInviteId,
        playerStatuses,
      }),
    );
  }

  // ======================
  // CREATE INVITE
  // ======================

  @SubscribeMessage(GAME_INVITE_EVENTS.CREATE)
  @AsyncApiSub({
    channel: GAME_INVITE_EVENTS.CREATE,
    message: {
      name: 'CreateGameInviteRequest',
      payload: CreateGameInviteDto,
    },
    summary: 'Create a new game invite',
    description: 'Sends a game invite to one or more users.',
    tags: [{ name: 'Game Invites' }],
  })
  async handleCreateInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateGameInviteDto,
  ) {
    try {
      const dto = CreateGameInviteSchema.parse(data);
      const user = this.verifyUser(client);

      const invite = await this.gameInviteService.createInvite(user.id, dto);

      const receiverSockets = await this.getInvitedUsersSocket(invite);

      this.emitToSockets(receiverSockets, GAME_INVITE_EVENTS.RECEIVED, `${user.username} invited you to ${dto.gameType}.`, invite);
      client.emit(GAME_INVITE_EVENTS.RECEIVED, this.socketResponse('Invite created successfully.', invite));
    } catch (error) {
      this.handleError(client, error, GAME_INVITE_EVENTS.CREATE);
    }
  }

  @AsyncApiPub({
    channel: GAME_INVITE_EVENTS.RECEIVED,
    message: {
      name: 'GameInviteReceivedEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Game invite received',
    description: 'Sent to invitee(s) and inviter when an invite is created.',
    tags: [{ name: 'Game Invites' }],
  })
  private emitToSockets(sockets: RemoteSocket<DefaultEventsMap, any>[], event: string, message: string, data: any) {
    sockets.forEach((s) => s.emit(event, this.socketResponse(message, data)));
  }

  // ======================
  // ACCEPT INVITE
  // ======================

  @SubscribeMessage(GAME_INVITE_EVENTS.ACCEPT)
  @AsyncApiSub({
    channel: GAME_INVITE_EVENTS.ACCEPT,
    message: {
      name: 'AcceptGameInviteRequest',
      payload: AcceptGameInviteDto,
    },
    summary: 'Accept a game invite',
    description: 'User accepts an invite; notifies inviter and acceptor.',
    tags: [{ name: 'Game Invites' }],
  })
  async handleAcceptInvite(
    @MessageBody() data: AcceptGameInviteDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      AcceptGameInviteSchema.parse(data);
      const { gameInviteId } = data;
      const invite = await this.gameInviteService.getInvite(gameInviteId);
      const user = this.verifyUser(client);

      await this.gameInviteService.acceptInvite(user.id, gameInviteId);

      const receiverSocket = await this.getLiveSocketFromServer(invite.fromUserId);

      if (receiverSocket) {
        receiverSocket.emit(
          GAME_INVITE_EVENTS.ACCEPTED,
          this.socketResponse(`${user.username} joined ${invite.gameType} #${invite.id.substring(0, 10)}.`, {
            gameInvite: invite,
            acceptor: user,
          }),
        );
      }

      client.emit(
        GAME_INVITE_EVENTS.ACCEPTED,
        this.socketResponse(`Your ${invite.gameType} game acceptance went successfully.`, {
          gameInvite: invite,
          acceptor: user,
        }),
      );
    } catch (error) {
      this.handleError(client, error, GAME_INVITE_EVENTS.ACCEPT);
    }
  }

  @AsyncApiPub({
    channel: GAME_INVITE_EVENTS.ACCEPTED,
    message: {
      name: 'GameInviteAcceptedEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Game invite accepted',
    description: 'Notifies both acceptor and inviter that the invite was accepted.',
    tags: [{ name: 'Game Invites' }],
  })
  // Note: Already emitted inline; this decorator documents the event

  // ======================
  // DECLINE INVITE
  // ======================

  @SubscribeMessage(GAME_INVITE_EVENTS.DECLINE)
  @AsyncApiSub({
    channel: GAME_INVITE_EVENTS.DECLINE,
    message: {
      name: 'DeclineGameInviteRequest',
      payload: GameInviteIdDto,
    },
    summary: 'Decline a game invite',
    description: 'User declines an invite; notifies inviter and decliner.',
    tags: [{ name: 'Game Invites' }],
  })
  async handleDeclineInvite(
    @MessageBody() data: { gameInviteId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { gameInviteId } = data;
      const user = this.verifyUser(client);
      const invite = await this.gameInviteService.getInvite(gameInviteId);
      if (!invite) throw new NotFoundException('Invite not found.');

      const declinedInvite = await this.gameInviteService.declineInvite(user.id, gameInviteId);
      const receiverSocket = await this.getLiveSocketFromServer(invite.fromUserId);

      if (receiverSocket) {
        receiverSocket.emit(
          GAME_INVITE_EVENTS.DECLINED,
          this.socketResponse(`${user.username} declined your invite for ${declinedInvite.gameType} game.`, {
            gameInviteId,
            declinedInvite,
            decliner: user,
          }),
        );
        client.emit(
          GAME_INVITE_EVENTS.DECLINED,
          this.socketResponse(`You declined ${declinedInvite.gameType} game invite successfully.`, {
            gameInviteId,
            declinedInvite,
            decliner: user,
          }),
        );
      }
    } catch (error) {
      this.handleError(client, error, GAME_INVITE_EVENTS.DECLINE);
    }
  }

  @AsyncApiPub({
    channel: GAME_INVITE_EVENTS.DECLINED,
    message: {
      name: 'GameInviteDeclinedEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Game invite declined',
    description: 'Notifies both parties that the invite was declined.',
    tags: [{ name: 'Game Invites' }],
  })

  // ======================
  // CANCEL INVITE
  // ======================

  @SubscribeMessage(GAME_INVITE_EVENTS.CANCEL)
  @AsyncApiSub({
    channel: GAME_INVITE_EVENTS.CANCEL,
    message: {
      name: 'CancelGameInviteRequest',
      payload: GameInviteIdDto,
    },
    summary: 'Cancel a game invite',
    description: 'Inviter cancels the invite; notifies all invited users.',
    tags: [{ name: 'Game Invites' }],
  })
  async handleCancelInvite(
    @MessageBody() data: { gameInviteId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { gameInviteId } = data;
      const user = this.verifyUser(client);
      const invite = await this.gameInviteService.getInvite(gameInviteId);
      const deletedGameInvite = await this.gameInviteService.cancelInvite(user.id, gameInviteId);
      const receiversSocket = await this.getInvitedUsersSocket(invite);

      receiversSocket.forEach((s) =>
        s.emit(
          GAME_INVITE_EVENTS.CANCELED,
          this.socketResponse(`${user.username} canceled ${invite.gameType} game invite.`, {
            gameInviteId,
            deletedGameInvite,
          }),
        ),
      );

      client.emit(
        GAME_INVITE_EVENTS.CANCELED,
        this.socketResponse(`${invite.gameType} game invite canceled successfully.`, {
          gameInviteId,
          deletedGameInvite,
        }),
      );
    } catch (error) {
      this.handleError(client, error, GAME_INVITE_EVENTS.CANCEL);
    }
  }

  @AsyncApiPub({
    channel: GAME_INVITE_EVENTS.CANCELED,
    message: {
      name: 'GameInviteCanceledEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Game invite canceled',
    description: 'Notifies all invited users and inviter that the invite was canceled.',
    tags: [{ name: 'Game Invites' }],
  })

  // ======================
  // ROOM EVENTS
  // ======================

  @SubscribeMessage(GAME_INVITE_ROOM_EVENTS.JOIN)
  @AsyncApiSub({
    channel: GAME_INVITE_ROOM_EVENTS.JOIN,
    message: {
      name: 'JoinGameInviteRoomRequest',
      payload: GameInviteIdDto,
    },
    summary: 'Join a game invite room',
    description: 'User joins a room to prepare for gameplay.',
    tags: [{ name: 'Game Invites' }],
  })
  async handleJoinGameRoom(
    @MessageBody() { gameInviteId }: { gameInviteId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.verifyUser(client);
    const room = this.getGameInviteRoomChannel(gameInviteId);
    client.join(room);
    client.data.gameInviteId = gameInviteId;

    const key = this.getGameInviteRoomPresenceKey(gameInviteId);
    await this.redis.hSet(key, user.id, JSON.stringify({ isConnected: true, isReady: false }));
    await this.redis.expire(key, 3600);
    await this.broadcastGameInviteRoomPresence(gameInviteId);

    client.emit(GAME_INVITE_ROOM_EVENTS.JOINED, this.socketResponse(`You joined ${gameInviteId}`, { gameInviteId }));
  }

  @AsyncApiPub({
    channel: GAME_INVITE_ROOM_EVENTS.JOINED,
    message: {
      name: 'JoinedGameInviteRoomEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Joined game invite room',
    description: 'Confirmation sent to user after joining room.',
    tags: [{ name: 'Game Invites' }],
  })

  @SubscribeMessage(GAME_INVITE_ROOM_EVENTS.LEAVE)
  @AsyncApiSub({
    channel: GAME_INVITE_ROOM_EVENTS.LEAVE,
    message: {
      name: 'LeaveGameInviteRoomRequest',
      payload: GameInviteIdDto,
    },
    summary: 'Leave a game invite room',
    description: 'User leaves the room; presence updated.',
    tags: [{ name: 'Game Invites' }],
  })
  async handleLeaveGameRoom(
    @MessageBody() { gameInviteId }: { gameInviteId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.verifyUser(client);
    const key = this.getGameInviteRoomPresenceKey(gameInviteId);
    await this.redis.hDel(key, user.id);
    await this.broadcastGameInviteRoomPresence(gameInviteId);
    client.emit(GAME_INVITE_ROOM_EVENTS.LEFT, this.socketResponse(`You left the game invite room.`, { gameInviteId }));
  }

  @AsyncApiPub({
    channel: GAME_INVITE_ROOM_EVENTS.LEFT,
    message: {
      name: 'LeftGameInviteRoomEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Left game invite room',
    description: 'Confirmation sent to user after leaving room.',
    tags: [{ name: 'Game Invites' }],
  })

  @SubscribeMessage(GAME_INVITE_ROOM_EVENTS.PLAYER_READY)
  @AsyncApiSub({
    channel: GAME_INVITE_ROOM_EVENTS.PLAYER_READY,
    message: {
      name: 'PlayerReadyRequest',
      payload: GameInviteIdDto,
    },
    summary: 'Mark player as ready',
    description: 'Player signals readiness; may trigger auto-start.',
    tags: [{ name: 'Game Invites' }],
  })
  async handlePlayerReady(
    @MessageBody() { gameInviteId }: { gameInviteId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.verifyUser(client);
    const key = this.getGameInviteRoomPresenceKey(gameInviteId);
    const current = await this.redis.hGet(key, user.id);
    if (!current) return;

    const status = JSON.parse(current) as PlayerPresenceStatus;
    status.isReady = true;
    await this.redis.hSet(key, user.id, JSON.stringify(status));
    await this.broadcastGameInviteRoomPresence(gameInviteId);

    // Auto-start logic remains unchanged
    const allEntries = await this.redis.hGetAll(key);
    const allReady = Object.values(allEntries).every((val) => {
      try {
        return JSON.parse(val as string).isReady;
      } catch {
        return false;
      }
    });
  }

  @SubscribeMessage(GAME_INVITE_ROOM_EVENTS.START)
  @AsyncApiSub({
    channel: GAME_INVITE_ROOM_EVENTS.START,
    message: {
      name: 'StartGameRequest',
      payload: GameInviteIdDto,
    },
    summary: 'Start the game',
    description: 'Owner starts the game if all players are ready.',
    tags: [{ name: 'Game Invites' }],
  })
  async updateGameHandler(
    @MessageBody() { gameInviteId }: { gameInviteId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.verifyUser(client);
    const gameInvite = await this.gameInviteService.fetchGameInviteDetail({
      userId: user.id,
      gameInviteId,
    });

    if (!gameInvite) throw new NotFoundException('Game not found. Try again later.');
    if (!gameInvite.game) throw new BadRequestException("Game wasn't created yet.");
    if (gameInvite.fromUserId !== user.id) throw new UnauthorizedException("You aren't authorized to start the game.");

    const key = this.getGameInviteRoomPresenceKey(gameInviteId);
    const allEntries = await this.redis.hGetAll(key);
    const allReady = Object.values(allEntries).every((val) => {
      try {
        return JSON.parse(val as string).isReady;
      } catch {
        return false;
      }
    });

    if (allReady) {
      const room = this.getGameInviteRoomChannel(gameInviteId);
      const updatedGame = await this.gameInviteService.updateGameInfo({
        gameId: gameInvite.game.id,
        game: { ...gameInvite.game, status: 'ACTIVE', startedAt: new Date() },
      });
      this.server.to(room).emit(GAME_INVITE_ROOM_EVENTS.STARTED, this.socketResponse(`Game started`, { game: updatedGame }));
    }
  }

  @AsyncApiPub({
    channel: GAME_INVITE_ROOM_EVENTS.STARTED,
    message: {
      name: 'GameStartedEvent',
      payload: GameInviteResponseDto,
    },
    summary: 'Game started',
    description: 'Broadcast to room when game officially begins.',
    tags: [{ name: 'Game Invites' }],
  })

  // ======================
  // ERROR HANDLING
  // ======================

  private handleError(client: Socket, error: unknown, context: GAME_INVITE_EVENTS) {
    if (error instanceof ZodError) {
      client.emit('error', {
        message: 'Validation failed',
        context,
        issues: error.issues,
      });
      this.logger.warn(`Validation error in ${context}:`, error.issues);
    } else if (error instanceof HttpException) {
      client.emit('error', {
        message: error.message,
        status: error.getStatus(),
        context,
        issues: error.stack,
      });
      this.logger.warn(`HttpException in ${context}:`, error.message);
    } else if (error instanceof Error) {
      client.emit('error', { message: error.message, context });
      this.logger.error(`Error in ${context}:`, error);
    } else {
      client.emit('error', { message: 'Unknown error', context });
      this.logger.error(`Unknown error in ${context}:`, error);
    }
  }
}