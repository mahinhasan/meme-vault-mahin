import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeVaultController } from './meme-vault.controller';
import { MemeVaultService } from './meme-vault.service';
import { Meme } from '../entity/meme.entity';
import { Vote } from '../entity/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meme, Vote])],
  controllers: [MemeVaultController],
  providers: [MemeVaultService],
})
export class MemeVaultModule {}