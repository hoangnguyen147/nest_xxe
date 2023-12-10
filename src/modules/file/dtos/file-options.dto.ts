import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class FileOptions {
  @ApiProperty()
  @IsString()
  readonly postId: Uuid;

  @ApiProperty()
  @IsString()
  readonly shareId: Uuid;

  @ApiProperty()
  @IsString()
  readonly isAvatar: string;
}
