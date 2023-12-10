import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @Column()
  @IsOptional()
  readonly school: string;

  @ApiProperty()
  @Column()
  @IsOptional()
  readonly studentId: string;
}
