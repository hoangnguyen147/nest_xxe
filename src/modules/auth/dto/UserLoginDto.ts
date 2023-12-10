import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly identity: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
