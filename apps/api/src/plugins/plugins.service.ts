import { Injectable, Logger, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { Plugin } from '@prisma/client';

@Injectable()
export class PluginsService implements OnModuleInit {
  private readonly logger = new Logger(PluginsService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const defaultPlugins = [
      {
        name: 'Google Analytics & Tag Manager',
        slug: 'google-analytics',
        description: 'Easily inject Google Tag Manager or GA4 measurement scripts to track traffic.',
        version: '1.0.0',
        isActive: false,
        headCode: `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-MEASUREMENT_ID');
</script>`,
        footerCode: '',
      },
      {
        name: 'Anti-AdBlock Detector Alert',
        slug: 'adblock-detector',
        description: 'Detects active AdBlock extensions and displays a polite bottom alert requesting whitelist.',
        version: '1.0.0',
        isActive: false,
        headCode: '',
        footerCode: `<!-- AdBlock Detector Alert -->
<script>
  (async function() {
    const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    try {
      await fetch(new Request(googleAdUrl, { method: 'HEAD', mode: 'no-cors' }));
    } catch {
      const alertDiv = document.createElement('div');
      alertDiv.style.position = 'fixed';
      alertDiv.style.bottom = '24px';
      alertDiv.style.right = '24px';
      alertDiv.style.background = 'rgba(239, 68, 68, 0.95)';
      alertDiv.style.color = '#ffffff';
      alertDiv.style.padding = '16px 20px';
      alertDiv.style.borderRadius = '16px';
      alertDiv.style.zIndex = '99999';
      alertDiv.style.maxWidth = '340px';
      alertDiv.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.5)';
      alertDiv.style.fontFamily = 'sans-serif';
      alertDiv.style.border = '1px solid rgba(255,255,255,0.1)';
      alertDiv.style.backdropFilter = 'blur(10px)';
      alertDiv.innerHTML = '<h5 style="margin:0 0 4px 0;font-weight:bold;font-size:15px;">AdBlock Active!</h5><p style="margin:0;font-size:12px;opacity:0.9;line-height:1.4;">Please support us by whitelisting TikSavePro. Ads keep this downloading service free.</p>';
      document.body.appendChild(alertDiv);
    }
  })();
</script>`,
      },
      {
        name: 'Quick Floating Social Share Buttons',
        slug: 'social-share',
        description: 'Injects styled floating shortcuts on the left margin for quick user link shares.',
        version: '1.0.0',
        isActive: false,
        headCode: '',
        footerCode: `<!-- Floating Social Share Buttons -->
<div style="position: fixed; left: 16px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 9999;">
  <a href="https://twitter.com/intent/tweet?text=Download TikTok videos in HD!" target="_blank" style="width: 44px; height: 44px; border-radius: 12px; background: #000000; border: 1px solid rgba(255,255,255,0.1); display: flex; items-center justify-content: center; align-items: center; color: #ffffff; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 14px; box-shadow: 0 10px 15px rgba(0,0,0,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">X</a>
  <a href="https://www.facebook.com/sharer/sharer.php?u=https://tiksavepro.com" target="_blank" style="width: 44px; height: 44px; border-radius: 12px; background: #1877f2; border: 1px solid rgba(255,255,255,0.1); display: flex; items-center justify-content: center; align-items: center; color: #ffffff; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 14px; box-shadow: 0 10px 15px rgba(0,0,0,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">F</a>
</div>`,
      }
    ];

    for (const plugin of defaultPlugins) {
      const exists = await this.prisma.plugin.findUnique({ where: { slug: plugin.slug } });
      if (!exists) {
        await this.prisma.plugin.create({ data: plugin });
      }
    }
  }

  // --- Dynamic EventEmitter Hooks (Existing backend hooks support) ---
  registerHook(eventName: string, callback: (...args: any[]) => void) {
    this.logger.log(`Registering hook for event: ${eventName}`);
    this.eventEmitter.on(eventName, callback);
  }

  emitEvent(eventName: string, payload: any) {
    this.logger.debug(`Emitting event: ${eventName}`);
    this.eventEmitter.emit(eventName, payload);
  }

  // --- Database Client Snapshot Plugin CRUD (Yoast & WordPress Extensibility) ---
  async findAll(): Promise<Plugin[]> {
    return this.prisma.plugin.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllActive(): Promise<Plugin[]> {
    return this.prisma.plugin.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Plugin | null> {
    return this.prisma.plugin.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    version?: string;
    headCode?: string;
    footerCode?: string;
    configJson?: string;
  }): Promise<Plugin> {
    const slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const exists = await this.prisma.plugin.findUnique({ where: { slug } });
    if (exists) {
      throw new HttpException('A plugin with this slug is already installed.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.plugin.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      version?: string;
      headCode?: string;
      footerCode?: string;
      configJson?: string;
    },
  ): Promise<Plugin> {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      throw new HttpException('Plugin not found.', HttpStatus.NOT_FOUND);
    }
    return this.prisma.plugin.update({
      where: { id },
      data,
    });
  }

  async toggleActive(id: string): Promise<Plugin> {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      throw new HttpException('Plugin not found.', HttpStatus.NOT_FOUND);
    }
    return this.prisma.plugin.update({
      where: { id },
      data: { isActive: !plugin.isActive },
    });
  }

  async delete(id: string): Promise<Plugin> {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      throw new HttpException('Plugin not found.', HttpStatus.NOT_FOUND);
    }
    return this.prisma.plugin.delete({ where: { id } });
  }
}
