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
        seoTitle: 'TikSavePro - Download TikTok Videos Without Watermark',
        seoDescription: 'Download TikTok videos without watermark in HD quality for free.',
        isPublished: true,
        layout: JSON.stringify([
          { 
            id: 'h-1', 
            type: 'hero', 
            title: 'Download TikTok Videos Without Watermark', 
            subtitle: 'Fast, free, and ad-supported online tool. Paste any public TikTok link to download your video.', 
            bgColor: '#0f172a',
            bgImage: '/contact-banner.jpg',
            badge: 'Fast & Watermark-Free'
          },
          { id: 'h-2', type: 'downloader_tool' }
        ])
      },
      {
        title: 'Video Downloader Page',
        slug: 'video',
        seoTitle: 'TikTok Video Downloader - TikSavePro',
        seoDescription: 'Download HD videos without watermark in MP4 format.',
        isPublished: true,
        layout: JSON.stringify([
          { 
            id: 'v-1', 
            type: 'hero', 
            title: 'TikTok Video Downloader', 
            subtitle: 'Download available HD videos without watermark directly in MP4 format.', 
            bgColor: '#0f172a',
            bgImage: '/contact-banner.jpg',
            badge: 'MP4 Video Downloader'
          },
          { id: 'v-2', type: 'downloader_tool' }
        ])
      },
      {
        title: 'Audio Extractor Page',
        slug: 'audio',
        seoTitle: 'TikTok Audio Extractor - TikSavePro',
        seoDescription: 'Extract and download MP3 audio from any TikTok video.',
        isPublished: true,
        layout: JSON.stringify([
          { 
            id: 'au-1', 
            type: 'hero', 
            title: 'TikTok Audio Extractor', 
            subtitle: 'Extract sound tracks and download audio in MP3 format from supported TikTok videos.', 
            bgColor: '#0f172a',
            bgImage: '/contact-banner.jpg',
            badge: 'MP3 Audio Extractor'
          },
          { id: 'au-2', type: 'audio_tool' }
        ])
      },
      {
        title: 'Bulk Downloader Page',
        slug: 'bulk',
        seoTitle: 'TikTok Profile Bulk Downloader - TikSavePro',
        seoDescription: 'Enter any TikTok username to fetch and download all their videos at once.',
        isPublished: true,
        layout: JSON.stringify([
          { 
            id: 'b-1', 
            type: 'hero', 
            title: 'TikTok Profile Bulk Downloader', 
            subtitle: 'Enter a public TikTok username to fetch and process multiple videos more conveniently.', 
            bgColor: '#0f172a',
            bgImage: '/contact-banner.jpg',
            badge: 'Profile Bulk Downloader'
          },
          { id: 'b-2', type: 'bulk_tool' }
        ])
      },
      {
        title: 'APK Download Page',
        slug: 'apk',
        seoTitle: 'Android APK Release - TikSavePro',
        seoDescription: 'Download the TikSavePro Android app.',
        isPublished: true,
        layout: JSON.stringify([
          { 
            id: 'ap-1', 
            type: 'hero', 
            title: 'Download Our Android App', 
            subtitle: 'Get the official TikSavePro Android application for your smartphone.', 
            bgColor: '#0f172a',
            bgImage: '/contact-banner.jpg',
            badge: 'Android APK Release'
          },
          { id: 'ap-2', type: 'apk_tool' }
        ])
      },
      {
        title: 'About Us',
        slug: 'about-us',
        seoTitle: 'About Us | Tik-TokDownloader.xyz',
        seoDescription: 'Learn about Tik-TokDownloader.xyz, our TikTok video, MP3, audio extraction and bulk download tools, and our commitment to a simple and responsible browsing experience.',
        isPublished: true,
        layout: JSON.stringify([
          { 
            id: 'ab-hero', 
            type: 'hero', 
            title: 'About Tik-TokDownloader.xyz', 
            subtitle: 'Simple, browser-based tools for downloading and working with publicly available TikTok content without complicated software.', 
            bgColor: '#0f172a',
            bgImage: '/contact-banner.jpg',
            badge: 'About Our Platform',
            ctaText: 'Start Downloading',
            ctaLink: '/',
            secondaryCtaText: 'Explore Our Tools',
            secondaryCtaLink: '/video'
          },
          { id: 'ab-h2-1', type: 'heading', level: 'h2', text: 'About Tik-TokDownloader.xyz' },
          { 
            id: 'ab-p-1', 
            type: 'paragraph', 
            text: 'Tik-TokDownloader.xyz is an online platform created to make saving and working with publicly available TikTok content straightforward and accessible directly through modern web browsers.\n\nWhether you need to save a video for personal offline reference, extract audio from a favorite clip, or process multiple video links, our tools are built to help you accomplish these tasks without installing third-party applications or navigating complicated setups.\n\nOur general workflow is straightforward:\n1. Copy the link of the publicly available TikTok content.\n2. Paste the URL into the appropriate tool on our platform.\n3. Select from the available download or extraction options provided.\n4. Save the file to your device.\n\nWe focus on delivering an accessible experience for everyday users who want a quick, web-based solution.' 
          },
          { id: 'ab-h2-2', type: 'heading', level: 'h2', text: 'Our Tools' },
          {
            id: 'ab-cards-1',
            type: 'cards_grid',
            items: [
              {
                title: 'TikTok Video Downloader',
                badge: 'Video MP4',
                description: 'Paste a TikTok video link and download the available video file directly through your browser with a clean, straightforward download experience.',
                ctaText: 'Try Video Downloader',
                ctaLink: '/video'
              },
              {
                title: 'TikTok MP3 Downloader',
                badge: 'Audio MP3',
                description: 'An audio-focused option designed for users who want to extract and download MP3 audio from supported TikTok content for offline listening.',
                ctaText: 'Try MP3 Downloader',
                ctaLink: '/audio'
              },
              {
                title: 'TikTok Audio Extractor',
                badge: 'Extractor',
                description: 'Extract the sound or audio track from supported TikTok clips when you only need the audio portion for personal offline use.',
                ctaText: 'Extract Audio',
                ctaLink: '/audio'
              },
              {
                title: 'TikTok Bulk Downloader',
                badge: 'Batch Tool',
                description: 'Process multiple TikTok video URLs more efficiently instead of downloading each individual video link one by one.',
                ctaText: 'Try Bulk Downloader',
                ctaLink: '/bulk'
              },
              {
                title: 'APK Downloader',
                badge: 'Android Utility',
                description: 'Explore APK downloads and Android app release updates available through our dedicated APK utility section.',
                ctaText: 'Explore APK Downloads',
                ctaLink: '/apk'
              }
            ]
          },
          { id: 'ab-h2-3', type: 'heading', level: 'h2', text: 'Why We Built the Platform' },
          { 
            id: 'ab-p-2', 
            type: 'paragraph', 
            text: 'We built Tik-TokDownloader.xyz with a focus on simplicity, utility, and user convenience. Many online utilities are overloaded with confusing steps, mandatory software installations, or intrusive sign-ups.\n\nOur platform focuses on:\n• Simple, accessible browser-based tools\n• Clean interfaces with straightforward copy-and-paste workflows\n• Responsive support for both mobile smartphones and desktop computers\n• Multiple download utilities in one organized destination\n• No unnecessary software installations or account requirements' 
          },
          { id: 'ab-h2-4', type: 'heading', level: 'h2', text: 'How It Works' },
          {
            id: 'ab-steps-1',
            type: 'steps',
            items: [
              {
                number: 1,
                title: 'Copy the TikTok Link',
                description: 'Find the publicly available TikTok video or audio you wish to process and copy its link from the browser or app.'
              },
              {
                number: 2,
                title: 'Paste the Link',
                description: 'Paste the copied URL into the input field of the relevant downloader tool on Tik-TokDownloader.xyz.'
              },
              {
                number: 3,
                title: 'Download Your File',
                description: 'Choose from the available output options and save the downloaded video or audio file directly to your device.'
              }
            ]
          },
          { id: 'ab-h2-5', type: 'heading', level: 'h2', text: 'Built for Mobile and Desktop' },
          { 
            id: 'ab-p-3', 
            type: 'paragraph', 
            text: 'Tik-TokDownloader.xyz is designed to function smoothly across modern web browsers on smartphones, tablets, laptops, and desktop computers. You do not need a specific operating system or specialized hardware—simply open the website in a compatible browser such as Chrome, Safari, Edge, or Firefox to access all available tools.' 
          },
          { id: 'ab-h2-6', type: 'heading', level: 'h2', text: 'Privacy & Responsible Use' },
          { 
            id: 'ab-p-4', 
            type: 'paragraph', 
            text: 'User privacy and responsible platform usage are core priorities. Tik-TokDownloader.xyz operates on a direct URL processing model and does not require users to create an account or provide TikTok account credentials.\n\nTik-TokDownloader.xyz is an independent third-party website and is not affiliated with, sponsored by, or endorsed by TikTok or ByteDance Ltd. Users are responsible for ensuring that their use of our tools complies with applicable laws, platform terms, and copyright requirements. For more details on data handling, please review our [Privacy Policy](/privacy).' 
          },
          { id: 'ab-h2-7', type: 'heading', level: 'h2', text: 'Respect Creators and Copyright' },
          { 
            id: 'ab-p-5', 
            type: 'paragraph', 
            text: 'Downloading or extracting media through our platform does not grant copyright ownership or redistribution licenses. All trademarks, videos, music, sounds, and content remain the intellectual property of their respective creators and copyright holders.\n\nWe encourage all users to:\n• Process content they own or have received permission to use\n• Respect original creator attribution\n• Avoid unauthorized reposting or commercial redistribution\n• Comply with platform guidelines and applicable copyright regulations' 
          },
          { id: 'ab-h2-8', type: 'heading', level: 'h2', text: 'Frequently Asked Questions' },
          {
            id: 'ab-faq-1',
            type: 'faq',
            items: [
              {
                question: 'What is Tik-TokDownloader.xyz?',
                answer: 'Tik-TokDownloader.xyz is a free, web-based platform providing online tools to download publicly available TikTok videos, extract MP3 audio, and process multiple links directly from your web browser.'
              },
              {
                question: 'Do I need to install an application?',
                answer: 'No installation is required. All tools run directly in any modern web browser on mobile or desktop devices. We also offer an optional Android app in our [APK section](/apk) for users who prefer a mobile app.'
              },
              {
                question: 'Can I use the website on my phone?',
                answer: 'Yes, the website is fully optimized for mobile browsers on iOS, Android, and tablets.'
              },
              {
                question: 'What tools are available?',
                answer: 'We provide a [TikTok Video Downloader](/video), [TikTok MP3 Downloader](/audio), [Audio Extractor](/audio), and [Bulk Profile Downloader](/bulk).'
              },
              {
                question: 'Can I download multiple TikTok videos?',
                answer: 'Yes, our [Bulk Downloader](/bulk) allows you to enter a public TikTok username to fetch and process multiple videos at once.'
              },
              {
                question: 'Can I extract audio from TikTok videos?',
                answer: 'Yes, our [Audio Extractor](/audio) extracts available audio tracks and allows you to download them in MP3 format.'
              },
              {
                question: 'Is Tik-TokDownloader.xyz affiliated with TikTok?',
                answer: 'No. Tik-TokDownloader.xyz is an independent third-party website and is not affiliated with, sponsored by, or endorsed by TikTok or ByteDance Ltd.'
              },
              {
                question: 'Can I download any TikTok video?',
                answer: 'Our tools process publicly available TikTok video links. Videos set to private, geo-restricted, or removed by creators/platform may not be accessible.'
              }
            ]
          },
          {
            id: 'ab-cta-1',
            type: 'cta_box',
            title: 'Have a Question or Need Support?',
            subtitle: 'If you have questions about our tools, experience an issue, or want to suggest improvements, get in touch with our team.',
            buttonText: 'Contact Us',
            buttonLink: '/contact-us'
          }
        ])
      },
      {
        title: 'Contact Us Page',
        slug: 'contact',
        seoTitle: 'Contact Us - TikSavePro',
        seoDescription: 'Get in touch with the TikSavePro support team.',
        isPublished: true,
        layout: JSON.stringify([
          { id: 'c-1', type: 'hero', title: 'Get In Touch', subtitle: 'Have a question, suggestion, or need support? We\'d love to hear from you.', bgColor: '#0f172a', bgImage: '/contact-banner.jpg', badge: 'Support & Inquiries' },
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
        if (exists.seoTitle?.includes('TTDownloader') || exists.layout?.includes('TTDownloader')) {
          const newSeoTitle = exists.seoTitle?.replace(/TTDownloader/g, 'TikSavePro');
          const newLayout = exists.layout?.replace(/TTDownloader/g, 'TikSavePro');
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
    const cleanSlug = slug.toLowerCase();
    let page = await this.prisma.page.findUnique({
      where: { slug: cleanSlug },
    });
    if (!page && (cleanSlug === 'contact-us' || cleanSlug === 'contact')) {
      page = await this.prisma.page.findFirst({
        where: { slug: { in: ['contact-us', 'contact'] } },
      });
    }
    return page;
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
    const systemSlugs = ['home', 'video', 'audio', 'bulk', 'apk', 'about', 'about-us', 'contact', 'contact-us'];
    if (systemSlugs.includes(page.slug)) {
      throw new HttpException('Cannot delete a system page', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.page.delete({
      where: { id },
    });
  }
}
