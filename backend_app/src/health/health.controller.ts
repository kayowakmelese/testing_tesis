import {
  Controller,
  Get,
  HttpStatus,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RedisIoAdapter } from '../shared/redis-io.adapter';
import Redis from 'ioredis';
import { EnvService } from 'src/env/env.service';

interface HealthCheckResult {
  status: 'OK' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptime: number;
  checks: {
    database?: CheckResult;
    redis?: CheckResult;
    websocket?: CheckResult;
    memory?: MemoryCheckResult;
  };
  details?: Record<string, any>;
}

interface CheckResult {
  status: 'UP' | 'DOWN' | 'UNKNOWN' | "DEGRADED";
  responseTimeMs?: number;
  error?: string;
}

interface MemoryCheckResult extends CheckResult {
  usedMB?: number;
  totalMB?: number;
  percentUsed?: number;
}

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    // private readonly redisIoAdapter: RedisIoAdapter,
    private readonly envService: EnvService
  ) {}

  @Get()
  async check(@Res() res: Response) {
    const startTime = Date.now();
    const checks: HealthCheckResult['checks'] = {};

    try {
      // Run all checks in parallel for better performance
      const [database, redis, memory] = await Promise.allSettled([
        this.checkDatabase(),
        this.checkRedis(),
        // this.checkWebSocket(),
        this.checkMemory(),
      ]);

      // Process results
      checks.database = database.status === 'fulfilled' ? database.value : {
        status: 'DOWN',
        error: database.reason?.message || 'Database check failed'
      };

      checks.redis = redis.status === 'fulfilled' ? redis.value : {
        status: 'DOWN', 
        error: redis.reason?.message || 'Redis check failed'
      };

      // checks.websocket = websocket.status === 'fulfilled' ? websocket.value : {
      //   status: 'DOWN',
      //   error: websocket.reason?.message || 'WebSocket check failed'
      // };

      checks.memory = memory.status === 'fulfilled' ? memory.value : {
        status: 'UNKNOWN',
        error: memory.reason?.message || 'Memory check failed'
      };

      // Determine overall status
      const statuses = Object.values(checks).map((c) => c.status);
      let overallStatus: 'OK' | 'DEGRADED' | 'DOWN' = 'OK';

      if (statuses.includes('DOWN')) {
        overallStatus = 'DOWN';
      } else if (statuses.includes('UNKNOWN')) {
        overallStatus = 'DEGRADED';
      }

      const result: HealthCheckResult = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Math.round((Date.now() - this.startTime) / 1000),
        checks,
      };

      const responseTime = Date.now() - startTime;

      // Set HTTP status code based on health
      const httpStatus = overallStatus === 'DOWN' 
        ? HttpStatus.SERVICE_UNAVAILABLE
        : HttpStatus.OK;

      // Add response time header
      res.setHeader('X-Response-Time', `${responseTime}ms`);

      return res.status(httpStatus).json(result);
    } catch (error) {
      this.logger.error('Health check failed', error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        error: 'Health check failed internally',
        details: {
          message: error.message,
        },
      });
    }
  }

  // 🔍 DATABASE CHECK
  private async checkDatabase(): Promise<CheckResult> {
    const start = Date.now();
    try {
      // Use a safer query method
      await this.prisma.$executeRaw`SELECT 1`;
      return {
        status: 'UP',
        responseTimeMs: Date.now() - start,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'DOWN',
        responseTimeMs: Date.now() - start,
        error: error.message,
      };
    }
  }

  // 🔍 REDIS CHECK
  private async checkRedis(): Promise<CheckResult> {
    const start = Date.now();
    let client: Redis | null = null;

    try {
      // Validate Redis URL
      if (!this.envService.get("REDIS_URL")) {
        throw new Error('REDIS_URL is not configured');
      }

      client = new Redis(this.envService.get("REDIS_URL"), {
        retryStrategy: () => null, // No retry for health check
        connectTimeout: 5000,
        commandTimeout: 5000,
        lazyConnect: true,
      });

      // Connect and ping
      await client.connect();
      const pong = await client.ping();
      
      await client.quit();

      return {
        status: pong === 'PONG' ? 'UP' : 'DOWN',
        responseTimeMs: Date.now() - start,
        error: pong !== 'PONG' ? `Unexpected ping response: ${pong}` : undefined,
      };
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      if (client && client.status !== 'end') {
        await client.quit().catch(() => {});
      }
      return {
        status: 'DOWN',
        responseTimeMs: Date.now() - start,
        error: error.message,
      };
    }
  }

  // 🔍 WEBSOCKET ADAPTER CHECK
//   private async checkWebSocket(): Promise<CheckResult> {
//   try {
//     const status = this.redisIoAdapter.getRedisStatus();
    
//     if (!status.isReady) {
//       return { 
//         status: 'DOWN', 
//         error: 'Redis adapter not ready' 
//       };
//     }

//     if (status.pubStatus === 'ready' && status.subStatus === 'ready') {
//       return { status: 'UP' };
//     } else if (status.pubStatus === 'connecting' || status.subStatus === 'connecting') {
//       return { 
//         status: 'DEGRADED', 
//         error: `Pub: ${status.pubStatus}, Sub: ${status.subStatus}` 
//       };
//     } else {
//       return { 
//         status: 'DOWN', 
//         error: `Pub: ${status.pubStatus}, Sub: ${status.subStatus}` 
//       };
//     }
//   } catch (error) {
//     this.logger.error('WebSocket health check failed', error);
//     return {
//       status: 'DOWN',
//       error: error.message,
//     };
//   }
// }

  // 🔍 MEMORY CHECK
  private checkMemory(): MemoryCheckResult {
    try {
      const memoryUsage = process.memoryUsage();
      const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
      const percentUsed = totalMB > 0 ? Math.round((usedMB / totalMB) * 100) : 0;

      let status: 'UP' | 'DOWN' | 'UNKNOWN' | "DEGRADED" = 'UP';
      if (percentUsed > 90) status = 'DOWN';
      else if (percentUsed > 75) status = 'DEGRADED';

      return {
        status,
        usedMB,
        totalMB,
        percentUsed,
      };
    } catch (error) {
      this.logger.error('Memory check failed', error);
      return {
        status: 'UNKNOWN',
        error: error.message,
      };
    }
  }
}