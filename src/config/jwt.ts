import { registerAs } from '@nestjs/config';

export const expiresIn: number | string = -1;
export const expiresInRedis: number = 60 * 60 * 24 * 7; // 7 days

export const signOptions: Record<string, any> = {};
if (expiresIn && expiresIn > 0) {
	signOptions.expiresIn = expiresIn;
}
export const jwtConfig = registerAs('jwt', () => ({
	signOptions: signOptions,
	expiresIn: expiresIn,
	expiresInRedis: expiresInRedis,
	jwtSecret: process.env.JWT_SECRET,
	jwtIssuer: process.env.JWT_ISSUER,
}));
