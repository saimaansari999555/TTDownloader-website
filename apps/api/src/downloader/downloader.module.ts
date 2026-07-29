import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DownloaderService } from './downloader.service';
import { DownloaderController } from './downloader.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [DownloaderService],
  controllers: [DownloaderController],
  exports: [DownloaderService],
})
export class DownloaderModule {}
