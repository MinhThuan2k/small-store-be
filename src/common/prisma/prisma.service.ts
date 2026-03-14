import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '@/common/shared/services/app-config.service';
import {
	Injectable,
	OnApplicationShutdown,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { softDelete } from './middlewares/softDelete';
import { PrismaClient } from '@/generated/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
	public readonly DEFAULT_PAGE = 1;
	public readonly DEFAULT_LIMIT = 20;
	constructor(private configService: ConfigService) {
		const adapter = new PrismaMariaDb(
			AppConfigService.getConfigDB(configService),
		);
		super({
			log: ['query', 'info', 'warn', 'error'],
			adapter,
		});
		const extended = this.$extends(softDelete);
		Object.assign(this, extended);
	}

	async onModuleInit() {
		try {
			await this.$connect();
			console.log('✅ Database OK!');
		} catch (err) {
			console.error('❌ Database connection failed:', err);
			throw new Error('Database connection failed');
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	async onApplicationShutdown() {
		await this.$disconnect();
	}

	calculateOffset(page: number, limit: number): { skip: number; take: number } {
		const pageNumber = Number(page) || this.DEFAULT_PAGE;
		const take = Number(limit) || this.DEFAULT_LIMIT;
		const skip = (pageNumber - 1) * Number(take);

		return { skip, take };
	}
}
