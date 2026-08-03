import { Controller, Post, Get, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file provided');
    return this.mediaService.saveMediaRecord(file);
  }

  @Post('url')
  async saveUrlMedia(@Body() body: { name?: string; url: string }) {
    return this.mediaService.saveUrlMediaRecord(body.name || 'image.png', body.url);
  }

  @Get()
  async getAllMedia() {
    return this.mediaService.getAllMedia();
  }

  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }
}

