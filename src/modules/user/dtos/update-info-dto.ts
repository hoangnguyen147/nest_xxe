import { UserRegisterDto } from '@/modules/auth/dto/UserRegisterDto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

export class UserUpdateInfo
  implements Omit<UserRegisterDto, 'email' | 'password'>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty()
  @Column()
  @IsOptional()
  readonly school: string;

  @ApiProperty()
  @Column()
  @IsOptional()
  readonly studentId: string;
}

export class UserUpdateAvatar {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly avatar: string;
}
