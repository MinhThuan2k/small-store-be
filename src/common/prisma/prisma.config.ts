import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'schema/',
	migrations: {
		path: 'schema/migrations',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
});
