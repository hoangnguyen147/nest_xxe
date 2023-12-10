import { RoleType } from './../../../constants/role-type';
import { ApiPropertyOptional } from '@nestjs/swagger';

import type { UserEntity } from '../user.entity';
import { AbstractDto } from '@/common/dto/abstract.dto';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  fullname: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  school?: string;

  @ApiPropertyOptional()
  studentId: string;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.fullname = user.fullname;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.school = user.school;
    this.studentId = user.studentId;
    this.isActive = options?.isActive;
  }
}
