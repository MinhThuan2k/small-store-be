import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { softDelete } from './middlewares/softDelete';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
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
}
