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

const imports = [
  ConfigModule.forRoot({ isGlobal: true }),
  PrismaModule,
  RedisModule,
  AuthModule,
  UsersModule,
  DataModule,
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
