import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemeVaultModule } from './meme-vault/meme-vault.module';
import { RedisModule } from './redis/redis.module';
import { Meme } from './entity/meme.entity';
import { Vote } from './entity/vote.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'meme_vault'),
        entities: [Meme, Vote],
        synchronize: true, // For development; use migrations for production
      }),
    }),
    RedisModule,
    MemeVaultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
