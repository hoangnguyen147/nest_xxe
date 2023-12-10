import { ShareService } from './share.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareRepository } from './share.repository';
import { ShareController } from './share.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShareRepository])],
  providers: [ShareService],
  controllers: [ShareController],
})
export class ShareModule {}
