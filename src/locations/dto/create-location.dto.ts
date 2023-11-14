import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  location_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  province: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  country: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  image: string;
}
