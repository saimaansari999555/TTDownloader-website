import { Injectable, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Page, Prisma } from '@prisma/client';

@Injectable()
export class PagesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const systemPages = [
      {
        title: 'Home Downloader',
        slug: 'home',
        seoTitle: 'TTDownloader - Download TikTok Videos Without Watermark',
        seoDescription: 'Download TikTok videos without watermark in HD quality for free.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'h-1', type: 'hero', title: 'Download TikTok Videos Without Watermark', subtitle: 'Fast, free, and completely ad-free. Just paste the link and get your video.', bgColor: '#8b5cf6' },
          { id: 'h-2', type: 'downloader_tool' }
        ])
      },
      {
        title: 'Video Downloader Page',
        slug: 'video',
        seoTitle: 'TikTok Video Downloader - TTDownloader',
        seoDescription: 'Download HD videos without watermark in MP4 format.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'v-1', type: 'hero', title: 'TikTok Video Downloader', subtitle: 'Download HD videos without watermark in MP4 format.', bgColor: '#3b82f6' },
          { id: 'v-2', type: 'downloader_tool' }
        ])
      },
      {
        title: 'Audio Extractor Page',
        slug: 'audio',
        seoTitle: 'TikTok Audio Extractor - TTDownloader',
        seoDescription: 'Extract and download MP3 audio from any TikTok video.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'au-1', type: 'hero', title: 'TikTok Audio Extractor', subtitle: 'Extract and download MP3 audio from any TikTok video.', bgColor: '#ec4899' },
          { id: 'au-2', type: 'audio_tool' }
        ])
      },
      {
        title: 'Bulk Downloader Page',
        slug: 'bulk',
        seoTitle: 'TikTok Profile Bulk Downloader - TTDownloader',
        seoDescription: 'Enter any TikTok username to fetch and download all their videos at once.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'b-1', type: 'hero', title: 'TikTok Profile Bulk Downloader', subtitle: 'Enter any TikTok username to fetch and download all their videos at once.', bgColor: '#10b981' },
          { id: 'b-2', type: 'bulk_tool' }
        ])
      },
      {
        title: 'APK Download Page',
        slug: 'apk',
        seoTitle: 'Android APK Release - TTDownloader',
        seoDescription: 'Download the TTDownloader Android app.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'ap-1', type: 'hero', title: 'Download Our Android App', subtitle: 'Get the TTDownloader Android app and download TikTok videos directly.', bgColor: '#f59e0b' },
          { id: 'ap-2', type: 'apk_tool' }
        ])
      },
      {
        title: 'About Us Page',
        slug: 'about',
        seoTitle: 'About Us - TTDownloader',
        seoDescription: 'About our TikTok downloading platform.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'ab-1', type: 'hero', title: 'About TTDownloader', subtitle: 'Built for Everyone, Always Free.', bgColor: '#1e293b' },
          { id: 'ab-2', type: 'paragraph', text: 'TTDownloader is a free, open-access platform for downloading TikTok content for educational and personal use. We believe everyone should have access to the content they love, without limitations.' }
        ])
      },
      {
        title: 'Contact Us Page',
        slug: 'contact',
        seoTitle: 'Contact Us - TTDownloader',
        seoDescription: 'Get in touch with the support team.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'c-1', type: 'hero', title: 'Get In Touch', subtitle: 'Have a question, suggestion, or need support? We\'d love to hear from you.', bgColor: '#0f172a' },
          { id: 'c-2', type: 'contact_tool' }
        ])
      }
    ];

    for (const page of systemPages) {
      const exists = await this.prisma.page.findUnique({ where: { slug: page.slug } });
      if (!exists) {
        await this.prisma.page.create({ data: page });
      } else {
        // Update existing seeded records if they contain old brand
        if (exists.seoTitle?.includes('TikSavePro') || exists.layout?.includes('TikSavePro')) {
          const newSeoTitle = exists.seoTitle?.replace(/TikSavePro/g, 'TTDownloader');
          const newLayout = exists.layout?.replace(/TikSavePro/g, 'TTDownloader');
          await this.prisma.page.update({
            where: { slug: page.slug },
            data: { seoTitle: newSeoTitle, layout: newLayout }
          });
        }
      }
    }
  }

  async findAll(): Promise<Page[]> {
    return this.prisma.page.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAllPublished(): Promise<Page[]> {
    return this.prisma.page.findMany({
      where: { isPublished: true },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string): Promise<Page | null> {
    return this.prisma.page.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Page | null> {
    return this.prisma.page.findUnique({
      where: { slug: slug.toLowerCase() },
    });
  }

  async create(data: {
    title: string;
    slug: string;
    layout: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    featuredImage?: string;
    isPublished?: boolean;
  }): Promise<Page> {
    const slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const exists = await this.prisma.page.findUnique({ where: { slug } });
    if (exists) {
      throw new HttpException('A page with this slug already exists', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.page.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      layout?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      featuredImage?: string;
      isPublished?: boolean;
    },
  ): Promise<Page> {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    let slug = page.slug;
    if (data.slug && data.slug.toLowerCase() !== page.slug) {
      slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const exists = await this.prisma.page.findUnique({ where: { slug } });
      if (exists) {
        throw new HttpException('A page with this slug already exists', HttpStatus.BAD_REQUEST);
      }
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
  }

  async delete(id: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }
    // Prevent deleting system pages
    const systemSlugs = ['home', 'video', 'audio', 'bulk', 'apk', 'about', 'contact'];
    if (systemSlugs.includes(page.slug)) {
      throw new HttpException('Cannot delete a system page', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.page.delete({
      where: { id },
    });
  }
}
