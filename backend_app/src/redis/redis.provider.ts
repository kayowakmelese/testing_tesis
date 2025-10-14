import { Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { EnvService } from 'src/env/env.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async (envService: EnvService) => {
    const redisURL = envService.get('REDIS_URL')
    const client = createClient({
      url: redisURL,
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    await client.connect();
    console.log('✅ Redis client (v4) connected for data operations');

    return client;
  },
  inject: [
    EnvService
  ],
};