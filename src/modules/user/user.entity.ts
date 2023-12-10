import { ShareEntity } from './../share/share.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { PostEntity } from '../post/post.entity';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import type { IUserSettingsEntity } from './user-settings.entity';
import { UserSettingsEntity } from './user-settings.entity';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  fullame?: string;

  role: RoleType;

  email?: string;

  password?: string;

  avatar?: string;

  settings?: IUserSettingsEntity;

  school?: string;

  studentId?: string;
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity
  extends AbstractEntity<UserDto, UserDtoOptions>
  implements IUserEntity
{
  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  fullname: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts: PostEntity[];

  @OneToMany(() => ShareEntity, (shareEntity) => shareEntity.user)
  shares: ShareEntity[];

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  studentId: string;
}
