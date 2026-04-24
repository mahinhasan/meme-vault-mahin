import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemeVaultService } from './meme-vault.service';
import { CreateMemeDto } from './dto/create-meme.dto';
import { VoteDto } from './dto/vote.dto';
import { Meme } from '../entity/meme.entity';

@ApiTags('memes')
@Controller('memes')
export class MemeVaultController {
  constructor(private readonly memeVaultService: MemeVaultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meme' })
  @ApiResponse({ status: 201, description: 'The meme has been successfully created.', type: Meme })
  async create(@Body() createMemeDto: CreateMemeDto) {
    return await this.memeVaultService.createMeme(createMemeDto);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top 10 memes by all-time score' })
  @ApiResponse({ status: 200, description: 'List of top 10 memes.', type: [Meme] })
  async getTop() {
    return await this.memeVaultService.getTopMemes();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get memes with the most votes in the last hour' })
  @ApiResponse({ status: 200, description: 'List of trending memes.', type: [Meme] })
  async getTrending() {
    return await this.memeVaultService.getTrendingMemes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single meme by ID' })
  @ApiResponse({ status: 200, description: 'The meme details with score.', type: Meme })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.memeVaultService.getMemeById(id);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Cast a vote on a meme' })
  @ApiResponse({ status: 201, description: 'Vote cast successfully.' })
  async vote(@Param('id', ParseIntPipe) id: number, @Body() voteDto: VoteDto) {
    return await this.memeVaultService.vote(id, voteDto.vote_type);
  }

  @Get('by-author/:author')
  @ApiOperation({ summary: 'Get all memes by a specific author' })
  @ApiResponse({ status: 200, description: 'List of memes by the author.', type: [Meme] })
  async getByAuthor(@Param('author') author: string) {
    return await this.memeVaultService.getMemesByAuthor(author);
  }
}