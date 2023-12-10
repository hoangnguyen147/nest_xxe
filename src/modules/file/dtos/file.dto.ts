import { UserEntity } from './../../user/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { FileEntity } from '../file.entity';

export class FileDto extends AbstractDto {
  filename: string;

  path: string;

  mimetype: string;

  size: number;

  uploadBy: Uuid;

  isAvatar: boolean;

  constructor(fileEntity: FileEntity) {
    super(fileEntity);
    this.filename = fileEntity.filename;
    this.path = fileEntity.path;
    this.mimetype = fileEntity.mimetype;
    this.size = fileEntity.size;
    this.uploadBy = fileEntity.uploadBy;
    this.isAvatar = fileEntity.isAvatar;
  }
}
