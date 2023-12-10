import { UserUpdateInfo, UserUpdateAvatar } from './dtos/update-info-dto';
import { UserRegisterDto } from './../auth/dto/UserRegisterDto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import type { FindConditions } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { UserNotFoundException } from '../../exceptions';
import type { Optional } from '../../types';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import type { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import type { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import type { UserSettingsEntity } from './user-settings.entity';
// import { AwsS3Service } from '@/shared/services/aws-s3.service';
import { UserSettingsRepository } from './user-settings.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userSettingsRepository: UserSettingsRepository,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindConditions<UserEntity>): Promise<Optional<UserEntity>> {
    return this.userRepository.findOne(findData);
  }

  async findByEmail(email: string): Promise<Optional<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (email) {
      queryBuilder.orWhere('user.email = :email', {
        email,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    await this.userRepository.save(user);

    user.settings = await this.createSettings(
      user.id,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
      }),
    );

    return user;
  }

  async updateInfo(
    userInfo: UserUpdateInfo,
    userAuth: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne(userAuth.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (userAuth.id !== user.id) {
      throw new UnauthorizedException();
    }

    user.fullname = userInfo.fullname;
    user.school = userInfo.school;
    user.studentId = userInfo.studentId;

    return await this.userRepository.save(user);
  }

  async updateAvatar(
    info: UserUpdateAvatar,
    userAuth: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne(userAuth.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (userAuth.id !== user.id) {
      throw new UnauthorizedException();
    }

    user.avatar = info.avatar;

    return await this.userRepository.save(user);
  }

  async getUsers(
    usersPageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const { takeAll, ...pageOptionsDto }: UsersPageOptionsDto =
      usersPageOptionsDto;
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoin<UserEntity, 'user'>('user.settings', 'settings')
      .select(['user', 'settings.isEmailVerified'])
      .searchByString(pageOptionsDto.q, ['user.email', 'user.fullname']);
    const [items, pageMetaDto] = await queryBuilder.paginate(
      usersPageOptionsDto,
      {
        takeAll,
      },
    );

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async createSettings(
    userId: Uuid,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    const userSettingsEntity =
      this.userSettingsRepository.create(createSettingsDto);

    userSettingsEntity.userId = userId;

    return this.userSettingsRepository.save(userSettingsEntity);
  }
}
