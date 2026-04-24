import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Meme } from '../entity/meme.entity';
import { Vote, VoteType } from '../entity/vote.entity';
import { CreateMemeDto } from './dto/create-meme.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MemeVaultService {
  constructor(
    @InjectRepository(Meme)
    private memeRepository: Repository<Meme>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    private redisService: RedisService,
  ) {}

  async createMeme(dto: CreateMemeDto): Promise<Meme> {
    const meme = this.memeRepository.create({
      title: dto.title,
      imageUrl: dto.image_url,
      author: dto.author,
      score: 0,
    });
    return await this.memeRepository.save(meme);
  }

  async getMemeById(id: number): Promise<Meme> {
    const meme = await this.memeRepository.findOneBy({ id });
    if (!meme) {
      throw new NotFoundException(`Meme with ID ${id} not found`);
    }
    return meme;
  }

  async vote(id: number, type: VoteType): Promise<{ score: number }> {
    const meme = await this.getMemeById(id);

    const vote = this.voteRepository.create({
      meme,
      type,
    });

    await this.voteRepository.save(vote);

    // Update meme score
    const scoreChange = type === VoteType.UP ? 1 : -1;
    meme.score += scoreChange;
    await this.memeRepository.save(meme);

    return { score: meme.score };
  }

  async getMemesByAuthor(author: string): Promise<Meme[]> {
    return await this.memeRepository.find({
      where: { author },
      order: { createdAt: 'DESC' },
    });
  }

  async getTopMemes(): Promise<Meme[]> {
    const cacheKey = 'memes:top';
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const memes = await this.memeRepository.find({
      order: { score: 'DESC' },
      take: 10,
    });

    await this.redisService.set(cacheKey, JSON.stringify(memes), 60); // 60s TTL
    return memes;
  }

  async getTrendingMemes(): Promise<Meme[]> {
    const cacheKey = 'memes:trending';
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const oneHourAgo = new Date(Date.now() - 3600000);

    // Trend calculation: Memes with most votes in last hour
    const trending = await this.memeRepository
      .createQueryBuilder('meme')
      .leftJoin('meme.votes', 'vote')
      .where('vote.created_at >= :oneHourAgo', { oneHourAgo })
      .select(['meme.id', 'meme.title', 'meme.image_url', 'meme.author', 'meme.score'])
      .addSelect('COUNT(vote.id)', 'voteCount')
      .groupBy('meme.id')
      .orderBy(' "voteCount" ', 'DESC')
      .limit(10)
      .getMany();

    await this.redisService.set(cacheKey, JSON.stringify(trending), 30); // 30s TTL
    return trending;
  }
}