import { Module } from '@nestjs/common';
import { PenaltyGateway } from './gateway/penalty.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { PenaltyGameController } from './penalty.controller';
import { PenaltyGameService } from './penalty.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [PenaltyGameController],
  providers: [PenaltyGameService, PenaltyGateway],
  exports: [PenaltyGameService],
})
export class PenaltyGameModule {}