import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: Redis;
  public prefix: string;
  public prefixUser: string;
  public secretKey: string;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('REDIS_URL');
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');
    this.prefix = this.configService.get<string>('REDIS_PREFIX');
    this.prefixUser = this.configService.get<string>('REDIS_PREFIX_USER');
    this.secretKey = this.configService.get<string>('REDIS_SECRET');

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

  async encryptToken(token: string): Promise<string> {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  async decryptToken(encryptedToken: any): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
