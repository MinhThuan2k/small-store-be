import mariadb from 'mariadb';
import { ConfigService } from '@nestjs/config';

export class AppConfigService {
	constructor(private configService: ConfigService) {}

	static getConfigDB(configService: ConfigService) {
		return {
			host: configService.get<string>('DB_HOST') || 'localhost',
			user: configService.get<string>('DB_USER') || 'root',
			password: configService.get<string>('DB_PASS') || '',
			database: configService.get<string>('DB_NAME') || 'mydb',
			port: configService.get<number>('DB_PORT') || 3306,
			connectionLimit: 10,
		};
	}
}
