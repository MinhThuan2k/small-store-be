import { ConfigModule, ConfigService } from '@nestjs/config';
import AppController from '@/app.controller';
import { AppService } from '@/app.service';
import { SharedModule } from '@/common/shared/shared.module';
import { Authentication } from '@/middleware/Authentication';
import { Oauth2Google } from '@/middleware/Oauth2Google';
import { RoleMiddleware } from '@/middleware/RoleMiddleware';
import { AuthModule, PrismaModule, RedisModule, UsersModule } from '@/modules';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ProductModule } from './modules/admin/products/product.module';
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n';
import path, { join } from 'path';
import { jwtConfig } from './config/jwt';

const imports = [
	ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: '.env',
		load: [jwtConfig],
	}),
	ClsModule.forRoot({ global: true, middleware: { mount: true } }),
	I18nModule.forRootAsync({
		useFactory: (configService: ConfigService) => ({
			fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE') || 'en',
			loaderOptions: {
				path: join(__dirname, '/i18n/'),
				watch: true,
			},
		}),
		resolvers: [
			{ use: QueryResolver, options: ['lang'] },
			AcceptLanguageResolver,
			new HeaderResolver(['x-lang']),
		],
		inject: [ConfigService],
	}),
	PrismaModule,
	RedisModule,
	AuthModule,
	UsersModule,
	SharedModule,
	ProductModule,
];

const exportsModule = [UsersModule];

const controllers = [AppController];

const providers = [
	{ provide: 'APP_GUARD', useClass: Authentication },
	{ provide: 'APP_GUARD', useClass: RoleMiddleware },
	AppService,
	Oauth2Google,
	GoogleOAuth2Service,
];

const middlewares = [];
@Module({
	imports: imports,
	exports: exportsModule,
	controllers: controllers,
	providers: providers,
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(...middlewares).forRoutes('*path');
	}
}
