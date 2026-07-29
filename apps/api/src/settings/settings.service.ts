import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSetting } from '@prisma/client';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const defaults = {
      site_name: 'TTDownloader',
      site_tagline: 'Fastest TikTok Video Downloader without Watermark',
      meta_description: 'Download TikTok videos without watermark in ultra high quality (HD) for free. Supports MP4, MP3 audio, and bulk profile downloads.',
      meta_keywords: 'tiktok downloader, no watermark, save tiktok, download tiktok mp4, tiktok audio, bulk download',
      google_analytics: 'G-XXXXXXXXXX',
      robots_txt: 'User-agent: *\nAllow: /',
      ad_top_code: '<div class="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic mb-6">Advertisement Slot (Top Banner)</div>',
      ad_bottom_code: '<div class="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic mt-8">Advertisement Slot (Bottom Banner)</div>',
      ad_sidebar_code: '<div class="w-full h-64 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic">Advertisement Slot (Sidebar Banner)</div>',
      ad_result_code: '<div class="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic my-4">Advertisement Slot (Download Result Page Banner)</div>',
      page_home_title: 'Download TikTok Videos Without Watermark',
      page_home_desc: 'Fast, free, and completely ad-free. Just paste the link and get your high-quality video instantly.',
      page_video_title: 'TikTok Video Downloader',
      page_video_desc: 'Download HD videos without watermark in MP4 format.',
      page_audio_title: 'TikTok Audio Extractor',
      page_audio_desc: 'Extract and download MP3 audio from any TikTok video.',
      page_bulk_title: 'TikTok Profile Bulk Downloader',
      page_bulk_desc: 'Enter any TikTok username to fetch all their videos at once.',
      page_apk_title: 'Download Our Android App',
      page_apk_desc: 'Get the TTDownloader Android app and download TikTok videos directly from your phone with ease.',
      page_about_content: 'TTDownloader is a free, open-access platform for downloading TikTok content for educational and personal use. We believe everyone should have access to the content they love, without limitations.',
      page_contact_email: 'contact@ttdownloader.xyz',
      primary_color: '#8b5cf6',
      custom_css: '',
      maintenance_mode: 'false',
      allow_registration: 'false',
    };

    for (const [key, value] of Object.entries(defaults)) {
      const exists = await this.prisma.systemSetting.findUnique({ where: { key } });
      if (!exists) {
        await this.prisma.systemSetting.create({ data: { key, value } });
      } else if (exists.value.includes('TikSavePro') || exists.value.includes('tiksavepro.com')) {
        const newValue = exists.value.replace(/TikSavePro/g, 'TTDownloader').replace(/tiksavepro\.com/g, 'ttdownloader.xyz');
        await this.prisma.systemSetting.update({
          where: { key },
          data: { value: newValue }
        });
      }
    }
  }

  async getAllSettings(): Promise<SystemSetting[]> {
    return this.prisma.systemSetting.findMany();
  }

  async getSetting(key: string): Promise<SystemSetting | null> {
    return this.prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  async updateSetting(key: string, value: string): Promise<SystemSetting> {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
