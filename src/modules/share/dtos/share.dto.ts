import { UserEntity } from '../../user/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ShareEntity } from '../share.entity';

export class ShareDto extends AbstractDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  link: string;

  @ApiPropertyOptional()
  thumbnail: string;

  @ApiPropertyOptional({ default: false })
  isPublic: boolean;

  user: UserEntity;

  constructor(shareEntity: ShareEntity) {
    super(shareEntity);
    this.title = shareEntity.title;
    this.description = shareEntity.description;
    this.link = shareEntity.link;
    this.thumbnail = shareEntity.thumbnail;
    this.isPublic = shareEntity.isPublic;
    this.user = shareEntity.user;
  }
}
