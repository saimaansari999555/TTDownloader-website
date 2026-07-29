import { Module } from '@nestjs/common';
import { ApkService } from './apk.service';
import { ApkController } from './apk.controller';

@Module({
  providers: [ApkService],
  controllers: [ApkController]
})
export class ApkModule {}
