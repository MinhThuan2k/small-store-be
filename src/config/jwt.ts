import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const jwtSecret = configService.get<string>('JWT_SECRET');

export const expiresIn: number | string = -1;
export const expiresInRedis: number = 60 * 60 * 24 * 7; // 7 days

export const signOptions: Record<string, any> = {};
if (expiresIn && expiresIn > 0) {
  signOptions.expiresIn = expiresIn;
}

export const jwtIssuer = configService.get<string>('JWT_ISSUER');
