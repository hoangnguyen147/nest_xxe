import { PostDto } from './dtos/post.dto';
import { DeletePostDto } from './dtos/delete-post.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Optional,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AdminPageRole, RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsPageOptionsDto } from './dtos/posts-page-options.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: PostDto })
  @ApiOperation({ summary: 'Thêm mới bài viết - [Master, Admin, Editor]' })
  @Auth(AdminPageRole)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: UserEntity,
  ) {
    const postEntity = await this.postService.createPost(
      user.id,
      createPostDto,
    );

    return postEntity.toDto();
  }

  @Get('user-get')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: PostDto })
  @ApiOperation({ summary: 'Lấy danh sách bài viết tại trang user' })
  async userGetPosts(@Query() postsPageOptionsDto: PostsPageOptionsDto) {
    return this.postService.getPostsForUser(postsPageOptionsDto);
  }

  @Get('admin-get')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: PostDto })
  @ApiOperation({ summary: 'Lấy danh sách bài viết tại trang admin' })
  @Auth(AdminPageRole)
  async adminGetPosts(@Query() postsPageOptionsDto: PostsPageOptionsDto) {
    return this.postService.getPostsForAdmin(postsPageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: PostDto,
    description: 'Lấy thông tin bài viết thành công',
  })
  @ApiOperation({ summary: 'Lấy thông tin bài viết' })
  async getOnePost(@Param('id') postId: Uuid) {
    return this.postService.getPostById(postId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiOperation({ summary: 'Xóa bài viết - [Master, Admin, Editor sở hữu]' })
  @Auth(AdminPageRole)
  async deletePost(@Param('id') postId: Uuid, @AuthUser() user: UserEntity) {
    return this.postService.deletePost(postId, user);
  }

  @Put('update-post/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: PostDto,
    description: 'Chỉnh sửa bài viết thành công',
  })
  @ApiOperation({
    summary: 'Chỉnh sửa bài viết - [Master, Admin, Editor sở hữu]',
  })
  @Auth(AdminPageRole)
  async updatePost(
    @Param('id') postId: Uuid,
    @Body() post: CreatePostDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.postService.updatePost(postId, post, user);
  }

  @Put('toggle-public/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiOperation({
    summary: 'Bật tắt trạng thái công khai - [Master, Admin, Editor sở hữu]',
  })
  @Auth(AdminPageRole)
  async toggleIsPublic(
    @Param('id') postId: Uuid,
    @AuthUser() user: UserEntity,
  ) {
    return this.postService.togglePublic(postId, user);
  }
}
