import { UserEntity } from './../../user/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { PostEntity } from '../post.entity';

export class PostDto extends AbstractDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  content: string;

  @ApiPropertyOptional()
  thumbnail: string;

  @ApiPropertyOptional({ default: false })
  isPublic: boolean;

  user: UserEntity;

  constructor(postEntity: PostEntity) {
    super(postEntity);
    this.title = postEntity.title;
    this.description = postEntity.description;
    this.content = postEntity.content;
    this.thumbnail = postEntity.thumbnail;
    this.isPublic = postEntity.isPublic;
    this.user = postEntity.user;
  }
}
