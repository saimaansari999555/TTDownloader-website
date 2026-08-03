import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Media } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async saveMediaRecord(file: Express.Multer.File): Promise<Media> {
    const url = `/uploads/${file.filename}`;
    return this.prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
      },
    });
  }

  async saveUrlMediaRecord(name: string, url: string): Promise<Media> {
    return this.prisma.media.create({
      data: {
        filename: `img-${Date.now()}`,
        originalName: name,
        mimeType: 'image/png',
        size: 0,
        url,
      },
    });
  }

  async getAllMedia(): Promise<Media[]> {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMedia(id: string): Promise<Media> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (media) {
      if (media.filename && media.filename.startsWith('img-')) {
        return this.prisma.media.delete({ where: { id } });
      }
      const filePath = path.join(__dirname, '..', '..', 'uploads', media.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return this.prisma.media.delete({ where: { id } });
    }
    throw new Error('Media not found');
  }
}

