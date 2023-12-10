import { AllRole, AdminPageRole } from './../../constants/role-type';
import { ApiFile, ApiPdfFile } from '@/decorators/api-file.decorator';
import { fileMimetypeFilter } from '@/filters/filter-mimetype.filter';
import { ParseFile } from '@/pipes/parse-file.pipe';
import { Controller, Delete, Param, Post, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as multer from 'multer';
import { FileService } from './file.service';
import { Auth, AuthUser } from '@/decorators';
import { UserEntity } from '../user/user.entity';

const uploadPath = process.env.UPLOAD_DESTINATION || './uploads';

const parseStorage = (destPath) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destPath);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname.split(' ').join('-').split('.')[0] +
          '-' +
          Date.now() +
          file.originalname.slice(file.originalname.lastIndexOf('.')),
      ); // strict here
    },
  });

@Controller('files')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/images')
  @ApiFile('image', true, {
    fileFilter: fileMimetypeFilter('image'),
    storage: parseStorage(`${uploadPath}/images`),
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE) * 1024 * 1024,
    },
  })
  @Auth(AdminPageRole)
  @ApiOperation({
    summary: 'Upload ảnh cho các bài viết, sharings - [Master, Admin, Editor]',
  })
  uploadFileToPost(
    @UploadedFile(ParseFile) file: Express.Multer.File,
    @AuthUser() user: UserEntity,
  ) {
    return this.fileService.saveFile(user.id, file);
  }

  @Post('upload/avatar')
  @ApiFile('image', true, {
    fileFilter: fileMimetypeFilter('image'),
    storage: parseStorage(`${uploadPath}/avatar`),
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE) * 1024 * 1024,
    },
  })
  @Auth(AllRole)
  @ApiOperation({ summary: 'Upload Avatar' })
  uploadAvatar(
    @UploadedFile(ParseFile) file: Express.Multer.File,
    @AuthUser() user: UserEntity,
  ) {
    return this.fileService.saveAvatar(user, file);
  }

  // @Post('uploads')
  // @ApiFiles('files', true, 10, {
  //   fileFilter: fileMimetypeFilter('image'),
  //   storage: parseStorage(`${uploadPath}/images`),
  //   limits: {
  //     fileSize: Number(process.env.MAX_FILE_SIZE) * 1024 * 1024,
  //   }
  // })
  // uploadFiles(@UploadedFiles(ParseFile) files: Array<Express.Multer.File>) {
  //   return files;
  // }

  // @Post('uploadFields')
  // @ApiFileFields([
  //   { name: 'avatar', maxCount: 1, required: true },
  //   { name: 'background', maxCount: 1 },
  // ], {
  //   fileFilter: fileMimetypeFilter('image'),
  //   storage: parseStorage(`${uploadPath}/images`),
  //   limits: {
  //     fileSize: Number(process.env.MAX_FILE_SIZE) * 1024 * 1024,
  //   }
  // })
  // uploadMultipleFiles(@UploadedFiles(ParseFile) files: Express.Multer.File[]) {
  //   return files;
  // }

  @Post('document')
  @ApiPdfFile('document', true)
  @ApiOperation({ summary: 'Upload PDF - Tạm chưa dùng' })
  uploadDocument(@UploadedFile(ParseFile) file: Express.Multer.File) {
    return file;
  }

  @Delete('images/:fileName')
  @Auth(AdminPageRole)
  @ApiOperation({ summary: 'Xóa ảnh' })
  deleteImages(
    @Param('fileName') fileName: string,
    @AuthUser() user: UserEntity,
  ) {
    return this.fileService.deleteFile(fileName, user, 'images');
  }

  @Delete('avatar/:fileName')
  @Auth(AllRole)
  @ApiOperation({ summary: 'Xóa avatar' })
  deleteAvatar(
    @Param('fileName') fileName: string,
    @AuthUser() user: UserEntity,
  ) {
    return this.fileService.deleteFile(fileName, user, 'avatar');
  }
}
