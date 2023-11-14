import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  check_in_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  check_out_date: Date;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  num_guests: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  room_id: number;
}
