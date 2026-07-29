import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { DownloaderService } from './downloader.service';

@Controller('downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Post('fetch')
  @HttpCode(HttpStatus.OK)
  async fetchVideo(@Body('url') url: string) {
    const data = await this.downloaderService.downloadVideo(url);
    return { success: true, data };
  }

  @Post('fetch-audio')
  @HttpCode(HttpStatus.OK)
  async fetchAudio(@Body('url') url: string) {
    const data = await this.downloaderService.downloadAudio(url);
    return { success: true, data };
  }

  @Get('bulk')
  async fetchUserVideos(
    @Query('username') username: string,
    @Query('cursor') cursor?: string,
    @Query('count') count?: string,
  ) {
    const data = await this.downloaderService.fetchUserVideos(
      username,
      cursor ? parseInt(cursor) : 0,
      count ? parseInt(count) : 20,
    );
    return { success: true, data };
  }
}
