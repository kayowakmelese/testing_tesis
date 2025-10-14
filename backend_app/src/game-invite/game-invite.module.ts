import { Module } from '@nestjs/common';
import { GameInviteService } from './game-invite.service';
import { GameInviteController } from './game-invite.controller';
import { GameInviteGateway } from './gateway/game-invite.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { PenaltyGameModule } from 'src/games/penalty/penalty.module';

@Module({
  imports: [RedisModule, PenaltyGameModule],
  providers: [GameInviteService, GameInviteGateway],
  controllers: [GameInviteController]
})
export class GameInviteModule {}
