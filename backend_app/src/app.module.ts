import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env/env.service';
import { EnvModule } from './env/env.module';
import { validateEnv } from './validators/env.validation';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';
import { PenaltyGameModule } from './games/penalty/penalty.module';
import { UsersModule } from './users/users.module';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaClientExceptionFilter } from './filters/prisma-exception.filter';
import { ZodValidationFilter } from './filters/zod-exception.filter';
import { GameInviteModule } from './game-invite/game-invite.module';
import { HealthModule } from './health/health.module';
import { RootGateway } from './gateways/root.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validateEnv,
    }),
    EnvModule,
    AuthModule,
    PrismaModule,
    SharedModule,
    PenaltyGameModule,
    UsersModule,
    GameInviteModule,
    HealthModule,
  ],
  providers: [
    AppService,
    EnvService,
    GamesService,
    RootGateway,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationFilter
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter
    },
  ],
  controllers: [AppController, GamesController],
})
export class AppModule { }
