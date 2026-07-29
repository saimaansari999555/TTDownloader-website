import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(AuthGuard('jwt'))
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
    return this.mediaService.saveMediaRecord(file);
  }

  @Get()
  async getAllMedia() {
    return this.mediaService.getAllMedia();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }
}
