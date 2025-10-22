import { ConfigModule } from '@nestjs/config';
import AppController from '@/app.controller';
import { AppService } from '@/app.service';
import { DataModule } from '@/common/data/data.module';
import { Authentication } from '@/middleware/Authentication';
import { Oauth2Google } from '@/middleware/Oauth2Google';
import { RoleMiddleware } from '@/middleware/RoleMiddleware';
import { AuthModule, PrismaModule, RedisModule, UsersModule } from '@/modules';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ProductModule } from './modules/admin/products/product.module';
import { I18nModule } from 'nestjs-i18n';
import path from 'path';

const imports = [
	ConfigModule.forRoot({ isGlobal: true }),
	ClsModule.forRoot({ global: true, middleware: { mount: true } }),
	I18nModule.forRoot({
		fallbackLanguage: 'en',
		loaderOptions: {
			path: path.join(__dirname, '/i18n/'),
			watch: true,
		},
	}),
	PrismaModule,
	RedisModule,
	AuthModule,
	UsersModule,
	DataModule,
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
