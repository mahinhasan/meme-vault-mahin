import { IsString, IsUrl, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemeDto {
  @ApiProperty({ example: 'Funny Cat' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'https://example.com/meme.jpg' })
  @IsUrl()
  @IsNotEmpty()
  @MaxLength(500)
  image_url: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;
}
