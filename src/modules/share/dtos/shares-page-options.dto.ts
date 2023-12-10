import { PageOptionsDto } from '@/common/dto/page-options.dto';
import { BooleanFieldOptional } from '@/decorators';

export class SharesPageOptionsDto extends PageOptionsDto {
  @BooleanFieldOptional()
  readonly takeAll?: boolean = false;
}
