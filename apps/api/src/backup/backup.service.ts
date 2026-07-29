import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  async exportData() {
    const [pages, settings, posts, releases, contacts, media] = await Promise.all([
      this.prisma.page.findMany(),
      this.prisma.systemSetting.findMany(),
      this.prisma.blogPost.findMany(),
      this.prisma.appRelease.findMany(),
      this.prisma.contactMessage.findMany(),
      this.prisma.media.findMany(),
    ]);

    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        pages,
        settings,
        posts,
        releases,
        contacts,
        media,
      },
    };
  }

  async importData(payload: any) {
    if (!payload || typeof payload !== 'object' || !payload.data) {
      throw new HttpException('Invalid backup file format.', HttpStatus.BAD_REQUEST);
    }

    const { pages, settings, posts, releases, contacts, media } = payload.data;

    try {
      await this.prisma.$transaction(async (tx) => {
        // Clear all existing data
        await tx.page.deleteMany();
        await tx.systemSetting.deleteMany();
        await tx.blogPost.deleteMany();
        await tx.appRelease.deleteMany();
        await tx.contactMessage.deleteMany();
        await tx.media.deleteMany();

        // Restore Pages
        if (Array.isArray(pages) && pages.length > 0) {
          // Re-insert pages one by one to avoid any adapter constraints
          for (const item of pages) {
            const { createdAt, updatedAt, ...rest } = item;
            await tx.page.create({ data: rest });
          }
        }

        // Restore SystemSettings
        if (Array.isArray(settings) && settings.length > 0) {
          for (const item of settings) {
            const { createdAt, updatedAt, ...rest } = item;
            await tx.systemSetting.create({ data: rest });
          }
        }

        // Restore BlogPosts
        if (Array.isArray(posts) && posts.length > 0) {
          for (const item of posts) {
            const { createdAt, updatedAt, ...rest } = item;
            await tx.blogPost.create({ data: rest });
          }
        }

        // Restore AppReleases
        if (Array.isArray(releases) && releases.length > 0) {
          for (const item of releases) {
            const { createdAt, updatedAt, ...rest } = item;
            await tx.appRelease.create({ data: rest });
          }
        }

        // Restore ContactMessages
        if (Array.isArray(contacts) && contacts.length > 0) {
          for (const item of contacts) {
            const { createdAt, updatedAt, ...rest } = item;
            await tx.contactMessage.create({ data: rest });
          }
        }

        // Restore Media
        if (Array.isArray(media) && media.length > 0) {
          for (const item of media) {
            const { createdAt, updatedAt, ...rest } = item;
            await tx.media.create({ data: rest });
          }
        }
      });

      return { message: 'Database backup restored successfully.' };
    } catch (err: any) {
      throw new HttpException(
        `Failed to restore database: ${err.message || err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

