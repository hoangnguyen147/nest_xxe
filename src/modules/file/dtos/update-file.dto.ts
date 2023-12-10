import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class UpdateFile {
  @ApiProperty()
  @IsString()
  readonly filenames: Array<string>;
}
