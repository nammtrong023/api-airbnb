import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, MinLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  room_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsInt()
  guest: number;

  @ApiProperty()
  @IsInt()
  bedrooms: number;

  @ApiProperty()
  @IsInt()
  bathrooms: number;

  @ApiProperty()
  @IsInt()
  beds: number;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsInt()
  washing_machine: number;

  @ApiProperty()
  @IsBoolean()
  tv: boolean;

  @ApiProperty()
  @IsBoolean()
  iron: boolean;

  @ApiProperty()
  @IsBoolean()
  air_conditioner: boolean;

  @ApiProperty()
  @IsBoolean()
  wifi: boolean;

  @ApiProperty()
  @IsBoolean()
  kitchen: boolean;

  @ApiProperty()
  @IsBoolean()
  parking: boolean;

  @ApiProperty()
  @IsBoolean()
  swimming_pool: boolean;

  @ApiProperty()
  @IsInt()
  location_id: number;
}
