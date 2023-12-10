import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeletePostDto {
  @ApiProperty()
  @IsString()
  readonly id: Uuid;
}
