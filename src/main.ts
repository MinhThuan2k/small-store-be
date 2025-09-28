import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import { setupSwagger } from '@/config/setupSwagger';
import { ExceptionHandle } from './exception/ExceptionHandle';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      querystringParser: (str) => qs.parse(str),
    }),
  );

  await app.register(fastifyCsrfProtection);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // API: /v1/auth, /v2/auth
  });

  app.useGlobalFilters(new ExceptionHandle());

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
