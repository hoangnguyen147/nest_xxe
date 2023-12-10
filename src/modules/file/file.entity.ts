import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { FileDto } from './dtos/file.dto';

@Entity({ name: 'files' })
@UseDto(FileDto)
export class FileEntity extends AbstractEntity<FileDto> {

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  uploadBy: Uuid;

  @Column({ default: false })
  isAvatar: boolean;

}

// Làm relationship mệt quá nên thôi lưu vậy luôn v: