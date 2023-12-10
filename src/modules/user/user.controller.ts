import type { Optional } from '../../types';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType, AllRole } from '../../constants';
import { ApiPageOkResponse, Auth, UUIDParam, AuthUser } from '../../decorators';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  UserUpdateAvatar,
  UserUpdateInfo,
} from '@/modules/user/dtos/update-info-dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Auth([RoleType.MASTER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Lấy danh sách User - [Master, Admin]' })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get('find')
  @Auth([RoleType.MASTER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by email',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Find User by email - [Master, Admin]' })
  findUserByEmail(
    @Query('email') email: string,
  ): Promise<Optional<UserEntity>> {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  @Auth([RoleType.MASTER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get User by id - [Master, Admin]' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by id',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Put('update-info')
  @Auth(AllRole)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Update Info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update successfully',
    type: UserDto,
  })
  updateInfo(
    @Body() userInfo: UserUpdateInfo,
    @AuthUser() userAuth: UserEntity,
  ): Promise<UserDto> {
    return this.userService.updateInfo(userInfo, userAuth);
  }

  @Patch('update-avatar')
  @Auth(AllRole)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Update Avatar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update successfully',
    type: UserDto,
  })
  updateAvatar(
    @Body() info: UserUpdateAvatar,
    @AuthUser() userAuth: UserEntity,
  ): Promise<UserDto> {
    return this.userService.updateAvatar(info, userAuth);
  }
}
