import { NotFoundException } from '@nestjs/common';

export class ShareNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.shareNotFound', error);
  }
}
