import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import { setupSwagger } from '@/config/setupSwagger';
import { ExceptionHandle } from './exception/ExceptionHandle';
import { AppModule } from './app.module';

dotenv.config();

let app: NestFastifyApplication | null = null;

export default async function handler(req: any, res: any) {
  if (!app) {
    const adapter = new FastifyAdapter({
      querystringParser: (str) => qs.parse(str),
    });

    app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

    await app.register(fastifyCsrfProtection);
    app.enableCors({
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    app.setGlobalPrefix('api');

    // Versioning: /v1/... /v2/...
    app.enableVersioning({
      type: VersioningType.URI,
    });

    app.useGlobalFilters(new ExceptionHandle());

    // Swagger
    setupSwagger(app);

    await app.init();
  }

  // ⚡ Forward request tới Fastify handler
  const instance = app.getHttpAdapter().getInstance();
  instance.routing(req, res);
}

if (require.main === module) {
  async function bootstrapLocal() {
    const adapter = new FastifyAdapter({
      querystringParser: (str) => qs.parse(str),
    });
    const localApp = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      adapter,
    );

    await localApp.register(fastifyCsrfProtection);
    localApp.enableCors({
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });
    localApp.setGlobalPrefix('api');
    localApp.enableVersioning({
      type: VersioningType.URI,
    });
    localApp.useGlobalFilters(new ExceptionHandle());
    setupSwagger(localApp);

    const port = process.env.PORT || 3000;
    await localApp.listen(port, '0.0.0.0');
    console.log(`🚀 Server running locally on http://localhost:${port}`);
  }
  bootstrapLocal();
}
