import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const database = this.configService.get<number>('REDIS_DB', 0);
    const password = this.configService.get<string>('REDIS_PASSWORD');
    
    this.client = createClient({
      url: `redis://${host}:${port}`,
      database,
      password: password || undefined,
    });

    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Connected to Redis');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    const result = await this.client.get(key);
    return result as string | null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, {
        EX: ttlSeconds,
      });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
