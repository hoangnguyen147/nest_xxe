import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateShareDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly link: string;

  @ApiProperty()
  @IsString()
  readonly thumbnail: string;
}
