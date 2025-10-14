import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: Redis;
  public prefix: string;
  public prefixUser: string;
  public expiresInRedis: number;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('REDIS_URL');
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');
    this.prefix = this.configService.get<string>('REDIS_PREFIX');
    this.prefixUser = this.configService.get<string>('REDIS_PREFIX_USER');
    this.expiresInRedis = 60 * 60 * 24 * 7;

    this.client = url
      ? new Redis(url)
      : new Redis({
          host: host,
          port: port || 6379,
        });
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      console.log('✅ Redis is ready!');
    } catch (err) {
      console.error('❌ Redis failed to connect', err);
    }
  }

  async onModuleDestroy() {
    await this.client.quit(); // Đóng kết nối khi module bị destroy
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const fullKey = this.prefix + ':' + key;
    const stringValue = JSON.stringify(value);
    let result;
    if (ttl) {
      result = await this.client.set(fullKey, stringValue, 'EX', ttl); // TTL = Time To Live
    } else {
      result = await this.client.set(fullKey, stringValue);
    }
    if (result !== 'OK') throw new Error('Redis SET failed');
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.prefix + ':' + key;
    const data = await this.client.get(fullKey);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setUserCache(value: string, userId: string): Promise<void> {
    const key = `${this.prefixUser}:${userId}`;
    await this.set(key, value, this.expiresInRedis);
  }
  async delUserCache(userId: string): Promise<void> {
    const key = `${this.prefixUser}:${userId}`;
    await this.delete(key);
  }
  async setToken(value: string, userId: string, jit: string): Promise<void> {
    const key = `${this.prefixUser}:${userId}:${jit}`;
    await this.set(key, value, this.expiresInRedis);
  }
  async getToken(userId: string, jit: string): Promise<string> {
    const key = `${this.prefixUser}:${userId}:${jit}`;
    const fullKey = this.prefix + ':' + key;
    return await this.client.get(fullKey);
  }
  async deleteToken(userId: string, jit: string): Promise<void> {
    const key = `${this.prefixUser}:${userId}:${jit}`;
    await this.delete(key);
  }
}
