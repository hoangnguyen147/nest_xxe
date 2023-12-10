import { RoleType } from '@/constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import * as fs from 'fs';
import { FileNotFoundException } from './exceptions/file-not-found.exception';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

const uploadPath = process.env.UPLOAD_DESTINATION || './uploads';

@Injectable()
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository,
  ) {}

  async saveFile(userId: Uuid, file: Express.Multer.File): Promise<FileEntity> {
    const { filename, path, mimetype, size } = file;
    const fileInfo = { filename, path, mimetype, size };
    const fileEntity = this.fileRepository.create({
      ...fileInfo,
      uploadBy: userId,
      isAvatar: false,
    });

    await this.fileRepository.save(fileEntity);

    return fileEntity;
  }

  async saveAvatar(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<FileEntity> {
    const { filename, path, mimetype, size } = file;
    const fileInfo = { filename, path, mimetype, size };
    const fileEntity = this.fileRepository.create({
      ...fileInfo,
      uploadBy: user.id,
      isAvatar: true,
    });

    await this.fileRepository.save(fileEntity);

    const oldAvatar = user.avatar;

    if (oldAvatar) {
      this.deleteFile(oldAvatar, user, 'avatar');
    }

    user.avatar = fileEntity.filename;

    this.userRepository.save(user);

    return fileEntity;
  }

  async deleteFile(fileName: string, user: UserEntity, dest: string) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const file = await this.fileRepository.findOne({
      filename: fileName,
    });

    if (!file) {
      throw new FileNotFoundException();
    }

    if (file.isAvatar && user.id !== file.uploadBy) {
      throw new UnauthorizedException();
    }

    if (
      user.role !== RoleType.MASTER &&
      user.role !== RoleType.ADMIN &&
      user.id !== file.uploadBy
    ) {
      throw new UnauthorizedException();
    }

    const deleteResponse = await this.fileRepository.delete(file.id);

    if (!deleteResponse.affected) {
      throw new FileNotFoundException();
    }

    fs.unlinkSync(`${uploadPath}/${dest}/${fileName}`);
  }
}
