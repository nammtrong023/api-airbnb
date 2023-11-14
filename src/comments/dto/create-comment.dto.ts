import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  comment_date: Date;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  star_rating: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  room_id: number;
}
