import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { BooleanFieldOptional } from '@/decorators';

export class PostsPageOptionsDto extends PageOptionsDto {
  @BooleanFieldOptional()
  readonly takeAll?: boolean = false;
}
