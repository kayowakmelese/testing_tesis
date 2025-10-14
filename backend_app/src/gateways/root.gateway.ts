import { Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { AsyncApi, AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { Server, Socket } from 'socket.io';


class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
}

class UserConnectionDto {
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  user: UserDto;
}

class WelcomeMessageDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  socketId: string;

  @ApiProperty()
  user: UserDto;
}

class ActiveUsersResponseDto {
  @ApiProperty()
  usersId: string[];
}

class EmptyPayloadDto { } // Represents empty payload

@AsyncApi()
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class RootGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RootGateway.name);

  constructor() {
    this.logger.log('✅ RootGateway initialized');
  }

  @AsyncApiPub({
    channel: 'welcome',
    message: {
      name: 'WelcomeEvent',
      payload: WelcomeMessageDto,
    },
    summary: 'Welcome message for newly connected client',
    description: 'Sent only to the connecting client after successful authentication. Includes user context and client ID.',
    tags: [
      {
        name: 'User Presence',
        description: 'Real-time user connection and presence events.',
      },
    ],
  })
  @AsyncApiPub({
    channel: 'new_user_connected',
    message: {
      name: 'UserConnectedEvent',
      payload: UserConnectionDto,
    },
    summary: 'Broadcast when a new user connects',
    description: 'Emitted to all connected clients (including the new one) when a user joins.',
    tags: [
      {
        name: 'User Presence',
        description: 'Real-time user connection and presence events.',
      },
    ],
  })
  handleConnection(client: Socket): void {
    const user = client.data.user as User;
    this.logConnection(user, client.id);

    this.broadcastNewUserConnection(client, user);
    this.sendWelcomeMessage(client, user);
  }

  // ========================================
  // DISCONNECTION: emits `user_disconnected`
  // ========================================

  @AsyncApiPub({
    channel: 'user_disconnected',
    message: {
      name: 'UserDisconnectedEvent',
      payload: UserConnectionDto,
    },
    summary: 'Broadcast when a user disconnects',
    description: 'Notifies all clients that a user has left the session.',
    tags: [
      {
        name: 'User Presence',
        description: 'Real-time user connection and presence events.',
      },
    ],
  })
  handleDisconnect(client: Socket): void {
    const user = client.data.user as User;
    this.logDisconnection(user, client.id);

    this.broadcastUserDisconnection(client, user);
  }

  // ========================================
  // REQUEST: get-active-users → active-users
  // ========================================

  @SubscribeMessage('get-active-users')
  @AsyncApiSub({
    channel: 'get-active-users',
    message: {
      name: 'GetActiveUsersRequest',
      payload: EmptyPayloadDto,
    },
    summary: 'Request active user list',
    description: 'Client sends this message with no payload to retrieve IDs of all currently connected users.',
    tags: [
      {
        name: 'User Presence',
        description: 'Real-time user connection and presence events.',
      },
    ],
  })
  async handleGetActiveUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() _data: any,
  ): Promise<void> {
    const activeUsers = await this.getAllActiveUsers();
    this.sendActiveUsers(client, activeUsers);
  }

  @AsyncApiPub({
    channel: 'active-users',
    message: {
      name: 'ActiveUsersResponse',
      payload: ActiveUsersResponseDto,
    },
    summary: 'Response with list of active users',
    description: 'Sent only to the client that requested the active user list.',
    tags: [
      {
        name: 'User Presence',
        description: 'Real-time user connection and presence events.',
      },
    ],
  })
  private sendActiveUsers(client: Socket, usersId: string[]): void {
    client.emit('active-users', usersId);
  }
  
  private logConnection(user: User, clientId: string): void {
    const username = user?.username || 'Anonymous';
    this.logger.debug(`👤 User Connected: ${username} (${clientId})`);
  }

  private logDisconnection(user: User, clientId: string): void {
    const username = user?.username || 'Anonymous';
    this.logger.debug(`👋 User Disconnected: ${username} (${clientId})`);
  }

  private broadcastNewUserConnection(client: Socket, user: User): void {
    const connectionData: UserConnectionDto = {
      clientId: client.id,
      user: {
        id: user?.id,
        username: user?.username || '',
        firstName: user?.firstName || undefined,
        lastName: user?.lastName || undefined,
      },
    };
    this.server.emit('new_user_connected', connectionData);
  }

  private sendWelcomeMessage(client: Socket, user: User): void {
    const welcomeData: WelcomeMessageDto = {
      message: 'Welcome to the game!',
      socketId: client.id,
      user: {
        id: user?.id,
        username: user?.username || '',
        firstName: user?.firstName || undefined,
        lastName: user?.lastName || undefined,
      },
    };
    client.emit('welcome', welcomeData);
  }

  private broadcastUserDisconnection(client: Socket, user: User): void {
    const disconnectionData: UserConnectionDto = {
      clientId: client.id,
      user: {
        id: user?.id,
        username: user?.username || '',
        firstName: undefined,
        lastName: undefined,
      },
    };
    this.server.emit('user_disconnected', disconnectionData);
  }

  async getAllActiveUsers(): Promise<string[]> {
    const sockets = await this.server.fetchSockets();
    return sockets
      .map((socket) => socket.data.user?.id)
      .filter(Boolean) as string[];
  }
}