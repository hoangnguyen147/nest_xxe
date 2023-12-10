import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { PostDto } from './dtos/post.dto';
@Entity({ name: 'posts' })
@UseDto(PostDto)
export class PostEntity extends AbstractEntity<PostDto> {
  @Column({ type: 'uuid' })
  userId: Uuid;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  thumbnail: string;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
