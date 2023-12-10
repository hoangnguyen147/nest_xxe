import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { ShareDto } from './dtos/share.dto';

@Entity({ name: 'shares' })
@UseDto(ShareDto)
export class ShareEntity extends AbstractEntity<ShareDto> {
  @Column({ type: 'uuid' })
  userId: Uuid;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  link: string;

  @Column()
  thumbnail: string;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.shares, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
