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

async function bootstrap() {
	const adapter = new FastifyAdapter({
		querystringParser: (str) => qs.parse(str),
	});
	const localApp = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		adapter,
	);

	(BigInt.prototype as any).toJSON = function () {
		return Number(this);
	};

	await localApp.register(fastifyCsrfProtection);
	localApp.enableCors({
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
bootstrap();
