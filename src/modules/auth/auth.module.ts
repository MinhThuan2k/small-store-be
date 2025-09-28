import { jwtSecret, signOptions } from '@/config/jwt';
import AuthController from '@/modules/auth/controllers/auth.controller';
import OAuth2Controller from '@/modules/auth/controllers/oauth2.controller';
import { LoginUserDto } from '@/modules/auth/dto/login.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { LoginTransform } from '@/modules/auth/transformers/login.transform';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: signOptions,
    }),
  ],
  controllers: [AuthController, OAuth2Controller],
  providers: [AuthService, GoogleOAuth2Service, LoginUserDto, LoginTransform],
})
export class AuthModule {}
