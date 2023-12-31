import { fileMimetypeFilter } from '@/filters/filter-mimetype.filter';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(
  fieldName: string = 'file',
  required: boolean = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function ApiImageFile(
  fileName: string = 'image',
  required: boolean = false,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('image'),
  });
}

export function ApiPdfFile(
  fileName: string = 'document',
  required: boolean = false,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('pdf'),
  });
}
