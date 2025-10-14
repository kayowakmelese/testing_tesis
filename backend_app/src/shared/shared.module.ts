// src/shared/shared.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisIoAdapter } from './redis-io.adapter';
import { AuthModule } from 'src/auth/auth.module';
import { PresenceService } from './presence/presence.service';
import { RedisModule } from 'src/redis/redis.module';

@Global() // 👈 Make it global — available everywhere
@Module({
   imports: [
    RedisModule,
  ],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class SharedModule { }
