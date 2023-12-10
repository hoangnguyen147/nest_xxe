import { BooleanFieldOptional } from '@/decorators';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class UsersPageOptionsDto extends PageOptionsDto {
  @BooleanFieldOptional()
  readonly takeAll?: boolean = false;
}
