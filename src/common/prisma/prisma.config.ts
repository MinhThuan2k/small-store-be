import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const configService = new ConfigService();

export function getConfigDB() {
	return {
		host: configService.get<string>('DB_HOST') || 'localhost',
		user: configService.get<string>('DB_USER') || 'root',
		password: configService.get<string>('DB_PASSWORD') || '',
		database: configService.get<string>('DB_NAME') || 'mydb',
	};
}

export default defineConfig({
	schema: 'schema/',
	migrations: {
		path: 'schema/migrations',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
});
