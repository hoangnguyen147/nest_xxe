import { UserEntity } from './../user/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import type { PageDto } from '../../common/dto/page.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import type { PostDto } from './dtos/post.dto';
import type { PostsPageOptionsDto } from './dtos/posts-page-options.dto';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import type { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';
import { RoleType } from '@/constants';
import { PageOptionsDto } from '@/common/dto/page-options.dto';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async createPost(
    userId: Uuid,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const postEntity = this.postRepository.create({ userId, ...createPostDto });

    await this.postRepository.save(postEntity);

    return postEntity;
  }

  async getPostsForUser(
    postsPageOptionsDto: PostsPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    const { takeAll, ...pageOptionsDto }: PostsPageOptionsDto =
      postsPageOptionsDto;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.description',
        'post.thumbnail',
        'post.createdAt',
        'post.updatedAt',
      ])
      .where('post.is_public = :isPublic', { isPublic: true })
      .searchByString(pageOptionsDto.q, ['post.title', 'post.description']);

    const [items, pageMetaDto] = await queryBuilder.paginate(
      postsPageOptionsDto,
      {
        takeAll,
      },
    );

    return items.toPageDto(pageMetaDto);
  }

  async getPostsForAdmin(
    postsPageOptionsDto: PostsPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    const { takeAll, ...pageOptionsDto }: PostsPageOptionsDto =
      postsPageOptionsDto;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect<PostEntity, 'post'>('post.user', 'user')
      .select(['post', 'user.id', 'user.fullname'])
      .searchByString(pageOptionsDto.q, [
        'post.title',
        'post.description',
        'post.content',
      ]);

    const [items, pageMetaDto] = await queryBuilder.paginate(
      postsPageOptionsDto,
      {
        takeAll,
      },
    );

    return items.toPageDto(pageMetaDto);
  }

  async getPostById(postId: Uuid): Promise<PostDto> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoin<PostEntity, 'post'>('post.user', 'user')
      .select(['post', 'user.fullname'])
      .where('post.id = :postId', { postId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new PostNotFoundException();
    }

    return userEntity.toDto();
  }

  async deletePost(postId: Uuid, user: UserEntity) {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new PostNotFoundException();
    }

    if (
      user.role != RoleType.ADMIN &&
      user.role != RoleType.MASTER &&
      post.userId != user.id
    ) {
      throw new UnauthorizedException();
    }

    const deleteResponse = await this.postRepository.delete(post.id);

    if (!deleteResponse.affected) {
      throw new PostNotFoundException();
    }
  }

  async togglePublic(postId: Uuid, user: UserEntity): Promise<PostEntity> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new PostNotFoundException();
    }

    if (
      user.role != RoleType.ADMIN &&
      user.role != RoleType.MASTER &&
      post.userId != user.id
    ) {
      throw new UnauthorizedException();
    }

    post.isPublic = !post.isPublic;

    return await this.postRepository.save(post);
  }

  async updatePost(
    postId: Uuid,
    postInfo: CreatePostDto,
    user: UserEntity,
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new PostNotFoundException();
    }

    if (
      user.role != RoleType.ADMIN &&
      user.role != RoleType.MASTER &&
      post.userId != user.id
    ) {
      throw new UnauthorizedException();
    }

    post.title = postInfo.title;
    post.content = postInfo.content;
    post.description = postInfo.description;
    post.thumbnail = postInfo.thumbnail;

    return await this.postRepository.save(post);
  }
}
