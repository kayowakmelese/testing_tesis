import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/types';

export class RedisIoAdapter extends IoAdapter {
  private adapter: any;

  constructor(private app: INestApplication, private redisUrl: string) {
    super(app);
  }

  async connect() {
    try {
      // Create and connect Redis clients
      const pubClient = createClient({ url: this.redisUrl });
      const subClient = pubClient.duplicate();

      await Promise.all([
        pubClient.connect(),
        subClient.connect()
      ]);

      console.log('✅ Redis clients connected');

      // Create adapter
      this.adapter = createAdapter(pubClient, subClient);
      console.log('✅ Redis adapter created');
    } catch (error) {
      console.error('❌ Redis connection failed:', error.message);
      throw error;
    }
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        credentials: true, // 👈 Fixed typo: was "credential"
      },
    });

    // 👇 ADD MIDDLEWARE HERE
    server.use(async (socket: Socket, next: any) => {
      console.log('🔌 Middleware: New connection attempt');
      try {
        const authService = this.app.get(AuthService)
        const jwtService = this.app.get(JwtService)

        // Example: Check auth token
        const token = socket.handshake.auth?.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const jwtPayload = await jwtService.verifyAsync<JwtPayload>(token)
        const user = await authService.verifyUser(jwtPayload)

        socket.data.user = user
        // For now, just accept
        console.log('✅ Token received:', token);
        next(); // Allow connection
      } catch (error) {
        console.log("Error on the middleware: ", error)
        next()
      }
    });


    const gameInviteNamespaceServer = server.of('/game-invite')

    gameInviteNamespaceServer.use(async (socket: Socket, next: any) => {
      console.log('\n gameInviteNamespaceServer It was running\n')
      try {
        const authService = this.app.get(AuthService)
        const jwtService = this.app.get(JwtService)

        // Example: Check auth token
        const token = socket.handshake.auth?.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const jwtPayload = await jwtService.verifyAsync<JwtPayload>(token)
        const user = await authService.verifyUser(jwtPayload)

        socket.data.user = user
        // For now, just accept
        console.log('✅ Token received GAME-INVITE:', token);
        next(); // Allow connection
      } catch (error) {
        console.log("Error on the middleware: ", error)
        next()
      }
    })

    const penaltyGameNamespaceServer = server.of('/penalty')

    penaltyGameNamespaceServer.use(async (socket: Socket, next: any) => {
      console.log('\n penaltyGameNamespaceServer It was running\n')
      try {
        const authService = this.app.get(AuthService)
        const jwtService = this.app.get(JwtService)

        // Example: Check auth token
        const token = socket.handshake.auth?.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const jwtPayload = await jwtService.verifyAsync<JwtPayload>(token)
        const user = await authService.verifyUser(jwtPayload)

        socket.data.user = user
        // For now, just accept
        console.log('✅ Token received GAME-INVITE:', token);
        next(); // Allow connection
      } catch (error) {
        console.log("Error on the middleware: ", error)
        next()
      }
    })

    console.log({ gameInviteNamespaceServer })

    // Attach adapter if ready
    if (this.adapter) {
      server.adapter(this.adapter);
      console.log('✅ Socket.IO Redis adapter attached');
    } else {
      console.warn('⚠️ Redis adapter not ready — using default');
    }

    return server;
  }

  // 👇 Extract middleware to reusable function
  private createAuthMiddleware() {
    return async (socket: Socket, next: any) => {
      try {
        const authService = this.app.get(AuthService);
        const jwtService = this.app.get(JwtService);

        const token = socket.handshake.auth?.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const jwtPayload = await jwtService.verifyAsync(token);
        const user = await authService.verifyUser(jwtPayload);

        socket.data.user = user;
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        next(new Error('Authentication failed'));
      }
    };
  }
}