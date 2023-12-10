import { CreateShareDto } from './dtos/create-share.dto';
import { ShareDto } from './dtos/share.dto';
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
import { ShareService } from './share.service';
import { SharesPageOptionsDto } from './dtos/shares-page-options.dto';

@Controller('shares')
@ApiTags('shares')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: ShareDto })
  @ApiOperation({ summary: 'Thêm mới bài chia sẻ - [Master, Admin, Editor]' })
  @Auth(AdminPageRole)
  async createShare(
    @Body() createShareDto: CreateShareDto,
    @AuthUser() user: UserEntity,
  ) {
    const shareEntity = await this.shareService.createShare(
      user.id,
      createShareDto,
    );

    return shareEntity.toDto();
  }

  @Get('user-get')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: ShareDto })
  @ApiOperation({ summary: 'Lấy danh sách bài chia sẻ tại trang user' })
  async userGetshares(@Query() sharesPageOptionsDto: SharesPageOptionsDto) {
    return this.shareService.getSharesForUser(sharesPageOptionsDto);
  }

  @Get('admin-get')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: ShareDto })
  @ApiOperation({ summary: 'Lấy danh sách bài chia sẻ tại trang admin' })
  @Auth(AdminPageRole)
  async adminGetshares(@Query() sharesPageOptionsDto: SharesPageOptionsDto) {
    return this.shareService.getSharesForAdmin(sharesPageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: ShareDto,
    description: 'Lấy thông tin bài chia sẻ thành công',
  })
  @ApiOperation({ summary: 'Lấy thông tin bài chia sẻ' })
  async getOneShare(@Param('id') shareId: Uuid) {
    return this.shareService.getShareById(shareId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiOperation({ summary: 'Xóa bài chia sẻ - [Master, Admin, Editor sở hữu]' })
  @Auth(AdminPageRole)
  async deleteShare(@Param('id') shareId: Uuid, @AuthUser() user: UserEntity) {
    return this.shareService.deleteShare(shareId, user);
  }

  @Put('update-share/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ShareDto,
    description: 'Chỉnh sửa bài chia sẻ thành công',
  })
  @ApiOperation({
    summary: 'Chỉnh sửa bài chia sẻ - [Master, Admin, Editor sở hữu]',
  })
  @Auth(AdminPageRole)
  async updateShare(
    @Param('id') shareId: Uuid,
    @Body() share: CreateShareDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.shareService.updateShare(shareId, share, user);
  }

  @Put('toggle-public/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiOperation({
    summary: 'Bật tắt trạng thái công khai - [Master, Admin, Editor sở hữu]',
  })
  @Auth(AdminPageRole)
  async toggleIsPublic(
    @Param('id') shareId: Uuid,
    @AuthUser() user: UserEntity,
  ) {
    return this.shareService.togglePublic(shareId, user);
  }
}
