import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoteType } from '../../entity/vote.entity';

export class VoteDto {
  @ApiProperty({ enum: VoteType, example: 'up' })
  @IsEnum(VoteType)
  @IsNotEmpty()
  vote_type: VoteType;
}
