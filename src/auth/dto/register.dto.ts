import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsDateString,
  IsIn,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  birth: Date;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([Gender.MALE, Gender.FEMALE], {
    message: "Invalid gender. It must be either 'MALE' or 'FEMALE'.",
  })
  gender: 'MALE' | 'FEMALE';

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([Role.HOST, Role.GUEST], {
    message: "Invalid role. It must be either 'HOST' or 'GUEST'.",
  })
  role: 'HOST' | 'GUEST';
}
