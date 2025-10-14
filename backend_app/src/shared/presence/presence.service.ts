import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from 'src/redis/redis.provider';

export type PlayerPresence = Record<string, {
    isConnected: boolean
    isReady?: boolean
}>; // e.g., { isConnected: boolean, isReady?: boolean }

@Injectable()
export class PresenceService {
    private readonly logger = new Logger(PresenceService.name);

    constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) { }

    async updatePlayerPresence(
        presenceKey: string,
        playerId: string,
        updates: Partial<PlayerPresence>,
    ): Promise<void> {
        const currentRaw = await this.redis.hGet(presenceKey, playerId);
        const current = currentRaw ? JSON.parse(currentRaw) : {};
        const updated = { ...current, ...updates };
        await this.redis.hSet(presenceKey, playerId, JSON.stringify(updated));
        await this.redis.expire(presenceKey, 3600); // 1 hour TTL
    }

    async removePlayerPresence(presenceKey: string, playerId: string): Promise<void> {
        await this.redis.hDel(presenceKey, playerId);
    }

    async getPlayerPresence(presenceKey: string): Promise<Record<string, PlayerPresence>> {
        const raw = await this.redis.hGetAll(presenceKey);
        const result: Record<string, PlayerPresence> = {};

        for (const [playerId, value] of Object.entries(raw)) {
            try {
                result[playerId] = JSON.parse(value);
            } catch (e) {
                this.logger.warn(`Invalid presence data for player ${playerId}`);
            }
        }

        return result;
    }

    
}