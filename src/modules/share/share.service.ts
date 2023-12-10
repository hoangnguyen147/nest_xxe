import { UserEntity } from '../user/user.entity';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { PageDto } from '../../common/dto/page.dto';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateShareDto } from './dtos/create-share.dto';
import type { ShareDto } from './dtos/share.dto';
import type { SharesPageOptionsDto } from './dtos/shares-page-options.dto';
import type { ShareEntity } from './share.entity';
import { RoleType } from '@/constants';
import { ShareRepository } from './share.repository';
import { ShareNotFoundException } from './exceptions/share-not-found.exception';
import { PageOptionsDto } from '@/common/dto/page-options.dto';

@Injectable()
export class ShareService {
  constructor(private shareRepository: ShareRepository) {}

  async createShare(
    userId: Uuid,
    createShareDto: CreateShareDto,
  ): Promise<ShareEntity> {
    const shareEntity = this.shareRepository.create({
      userId,
      ...createShareDto,
    });

    await this.shareRepository.save(shareEntity);

    return shareEntity;
  }

  async getSharesForUser(
    sharesPageOptionsDto: SharesPageOptionsDto,
  ): Promise<PageDto<ShareDto>> {
    const { takeAll, ...pageOptionsDto }: SharesPageOptionsDto =
      sharesPageOptionsDto;
    const queryBuilder = this.shareRepository
      .createQueryBuilder('share')
      .select([
        'share.id',
        'share.title',
        'share.description',
        'share.thumbnail',
        'share.link',
        'share.createdAt',
        'share.updatedAt',
      ])
      .where('share.is_public = :isPublic', { isPublic: true })
      .searchByString(pageOptionsDto.q, ['share.title', 'share.description']);

    const [items, pageMetaDto] = await queryBuilder.paginate(
      sharesPageOptionsDto,
      {
        takeAll,
      },
    );

    return items.toPageDto(pageMetaDto);
  }

  async getSharesForAdmin(
    sharesPageOptionsDto: SharesPageOptionsDto,
  ): Promise<PageDto<ShareDto>> {
    const { takeAll, ...pageOptionsDto }: SharesPageOptionsDto =
      sharesPageOptionsDto;
    const queryBuilder = this.shareRepository
      .createQueryBuilder('share')
      .leftJoinAndSelect<ShareEntity, 'share'>('share.user', 'user')
      .select(['share', 'user.id', 'user.fullname'])
      .searchByString(pageOptionsDto.q, [
        'share.title',
        'share.description',
        'share.link',
      ]);

    const [items, pageMetaDto] = await queryBuilder.paginate(
      sharesPageOptionsDto,
      {
        takeAll,
      },
    );

    return items.toPageDto(pageMetaDto);
  }

  async getShareById(shareId: Uuid): Promise<ShareDto> {
    const queryBuilder = this.shareRepository
      .createQueryBuilder('share')
      .leftJoin<ShareEntity, 'share'>('share.user', 'user')
      .select(['share', 'user.fullname'])
      .where('share.id = :shareId', { shareId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new ShareNotFoundException();
    }

    return userEntity.toDto();
  }

  async deleteShare(shareId: Uuid, user: UserEntity) {
    const share = await this.shareRepository.findOne(shareId);

    if (!share) {
      throw new ShareNotFoundException();
    }

    if (
      user.role != RoleType.ADMIN &&
      user.role != RoleType.MASTER &&
      share.userId != user.id
    ) {
      throw new UnauthorizedException();
    }

    const deleteResponse = await this.shareRepository.delete(share.id);

    if (!deleteResponse.affected) {
      throw new ShareNotFoundException();
    }
  }

  async togglePublic(shareId: Uuid, user: UserEntity): Promise<ShareEntity> {
    const share = await this.shareRepository.findOne(shareId);

    if (!share) {
      throw new ShareNotFoundException();
    }

    if (
      user.role != RoleType.ADMIN &&
      user.role != RoleType.MASTER &&
      share.userId != user.id
    ) {
      throw new UnauthorizedException();
    }

    share.isPublic = !share.isPublic;

    return await this.shareRepository.save(share);
  }

  async updateShare(
    shareId: Uuid,
    shareInfo: CreateShareDto,
    user: UserEntity,
  ): Promise<ShareEntity> {
    const share = await this.shareRepository.findOne(shareId);

    if (!share) {
      throw new ShareNotFoundException();
    }

    if (
      user.role != RoleType.ADMIN &&
      user.role != RoleType.MASTER &&
      share.userId != user.id
    ) {
      throw new UnauthorizedException();
    }

    share.title = shareInfo.title;
    share.link = shareInfo.link;
    share.description = shareInfo.description;
    share.thumbnail = shareInfo.thumbnail;

    return await this.shareRepository.save(share);
  }
}
