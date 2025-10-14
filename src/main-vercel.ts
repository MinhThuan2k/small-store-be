import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from '@/config/setupSwagger';
import { ExceptionHandle } from './exception/ExceptionHandle';
import fastifyCsrfProtection from '@fastify/csrf-protection';

dotenv.config();
console.log('>>> NestJS on Vercel handler loaded');

let cachedApp: NestFastifyApplication;

async function createApp(): Promise<NestFastifyApplication> {
  const adapter = new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  await app.register(fastifyCsrfProtection);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new ExceptionHandle());
  setupSwagger(app);

  await app.init();
  return app;
}

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }

  const fastify = cachedApp.getHttpAdapter().getInstance();

  fastify.routing(req, res);
}
