import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { RedisIoAdapter } from './shared/redis-io.adapter';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';

import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*"
    },
    logger: ['error', 'warn', 'log', 'debug']
  });

  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix("/api/v1");

  const envService = app.get(EnvService);

  // Simple Redis URL from env or hardcoded
  const redisUrl = process.env.REDIS_URL!;

  // Create and connect adapter
  const redisIoAdapter = new RedisIoAdapter(app, redisUrl);
  await redisIoAdapter.connect();

  // Set adapter
  app.useWebSocketAdapter(redisIoAdapter);


  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('PulsePlay Gaming API')
    .setDescription('API for Telegram-based gaming platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(document));

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Gaming Realtime API')
    .setDescription('API using WebSockets / pub-sub')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addServer('ws', {
      url: 'ws://localhost:3000',      // or wss, domain, etc.
      protocol: 'socket.io'            // if using socket.io, or “websocket” if raw WS
    })
    // you can add more servers if needed
    .build()

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);

  // Expose the AsyncAPI UI / endpoint, e.g. at /asyncapi
  await AsyncApiModule.setup('/asyncapi', app, asyncapiDocument);


  const PORT = envService.get('PORT') || 3000;

  await app.listen(PORT);
  Logger.log(`🚀 Server running on PORT ${PORT}`);
  Logger.log(`📚 Swagger docs: http://localhost:${PORT}/docs`);
}


void bootstrap().catch(error => {
  Logger.error('❌ Failed to start server', error);
  process.exit(1);
});