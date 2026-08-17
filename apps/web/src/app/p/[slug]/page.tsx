'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCustomPageBySlug } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

// Import interactive tools
import VideoDownloader from '@/components/tools/VideoDownloader';
import AudioDownloader from '@/components/tools/AudioDownloader';
import BulkDownloader from '@/components/tools/BulkDownloader';
import ApkDownloader from '@/components/tools/ApkDownloader';
import ContactFormTool from '@/components/tools/ContactFormTool';

const DEFAULT_SYSTEM_PAGES: Record<string, any> = {
  home: {
    title: 'Home Downloader',
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
  video: {
    title: 'TikTok Video Downloader',
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
  audio: {
    title: 'TikTok Audio Extractor',
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
  bulk: {
    title: 'TikTok Profile Bulk Downloader',
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
  apk: {
    title: 'Download Our Android App',
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
  'about-us': {
    title: 'About Us',
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
  'contact-us': {
    title: 'Contact Us Page',
    seoTitle: 'Contact Us - TikSavePro',
    seoDescription: 'Get in touch with the TikSavePro support team for feedback, questions, assistance, bug reports, and general inquiries.',
    isPublished: true,
    layout: JSON.stringify([
      { 
        id: 'c-1', 
        type: 'hero', 
        title: 'Get In Touch', 
        subtitle: "Have a question, suggestion, or need support? We'd love to hear from you.", 
        bgColor: '#0f172a',
        bgImage: '/contact-banner.jpg',
        badge: 'Support & Inquiries'
      },
      { id: 'c-2', type: 'contact_tool' }
    ])
  },
  contact: {
    title: 'Contact Us Page',
    seoTitle: 'Contact Us - TikSavePro',
    seoDescription: 'Get in touch with the TikSavePro support team for feedback, questions, assistance, bug reports, and general inquiries.',
    isPublished: true,
    layout: JSON.stringify([
      { 
        id: 'c-1', 
        type: 'hero', 
        title: 'Get In Touch', 
        subtitle: "Have a question, suggestion, or need support? We'd love to hear from you.", 
        bgColor: '#0f172a',
        bgImage: '/contact-banner.jpg',
        badge: 'Support & Inquiries'
      },
      { id: 'c-2', type: 'contact_tool' }
    ])
  },
  privacy: {
    title: 'Privacy Policy Page',
    seoTitle: 'Privacy Policy - TikSavePro',
    seoDescription: 'Read the privacy policy of Tik-TokDownloader.xyz to understand how we protect user privacy.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'p-1', type: 'hero', title: 'Privacy Policy', subtitle: 'Your privacy is extremely important to us. Learn how we handle information on Tik-TokDownloader.xyz.', bgColor: '#0f172a' },
      { id: 'p-2', type: 'heading', level: 'h2', text: '1. Information We Collect' },
      { id: 'p-3', type: 'paragraph', text: 'We believe in keeping things simple and secure. We do not require any personal registrations, accounts, or login details to use our services.\n\nHowever, standard web servers collect basic logs automatically. This includes your IP address, browser type, device details, and referencing pages. This info is used purely for diagnostics, analytics, and service optimizations.' },
      { id: 'p-4', type: 'heading', level: 'h2', text: '2. TikTok URL Processing' },
      { id: 'p-5', type: 'paragraph', text: 'Our downloader works entirely on URL processing. When you input a TikTok video URL, our platform processes that link to retrieve direct download media addresses.\n\nWe do not store downloaded videos or audio files on our servers. The actual download is processed in real-time and served to your browser client directly.' },
      { id: 'p-6', type: 'heading', level: 'h2', text: '3. Cookies & Local Storage' },
      { id: 'p-7', type: 'paragraph', text: 'TikTokDownloader.xyz may use cookies to store your preferences, search selections, or system theme status.\n\nWe also use browser localStorage to allow safe saving and layout settings cache. You can reset these settings anytime by clicking the Clear Cache option in user settings or deleting browser cookies.' },
      { id: 'p-8', type: 'heading', level: 'h2', text: '4. Third-Party Advertisements' },
      { id: 'p-9', type: 'paragraph', text: 'We may display banner advertisements from third-party networks (such as Google AdSense) to support website operation costs. These ad providers may set tracking cookies to serve targeted ads based on your search history and web visits.' },
      { id: 'p-10', type: 'heading', level: 'h2', text: '5. Children\'s Privacy' },
      { id: 'p-11', type: 'paragraph', text: 'Our tools are built for public web access and do not target or harvest data from children under the age of 13. If you believe a child has provided any tracking details, please contact us.' },
      { id: 'p-12', type: 'heading', level: 'h2', text: '6. Policy Updates' },
      { id: 'p-13', type: 'paragraph', text: 'This Privacy Policy is subject to change at any time to comply with legal guidelines or technical system additions. Any changes will be updated on this page immediately.' }
    ])
  }
};

export default function CustomPage({ params }: { params: any }) {
  const [page, setPage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (!params) return;
    // Check if params is a Promise or thenable (Next.js 15+)
    Promise.resolve(params).then((res: any) => {
      setSlug(res?.slug || (typeof params === 'object' && params?.slug) || null);
    }).catch(() => {
      setSlug(params?.slug || null);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    const loadPageData = async () => {
      const normalizedSlug = slug.toLowerCase();
      try {
        let res = await getCustomPageBySlug(normalizedSlug);
        // If not found and slug is contact-us/contact or about-us/about, try the alias
        if (!res || !res.isPublished) {
          if (normalizedSlug === 'contact-us') {
            res = await getCustomPageBySlug('contact');
          } else if (normalizedSlug === 'contact') {
            res = await getCustomPageBySlug('contact-us');
          } else if (normalizedSlug === 'about-us') {
            res = await getCustomPageBySlug('about');
          } else if (normalizedSlug === 'about') {
            res = await getCustomPageBySlug('about-us');
          }
        }

        const resolveFallback = (s: string) => {
          if (DEFAULT_SYSTEM_PAGES[s]) return DEFAULT_SYSTEM_PAGES[s];
          if (s === 'contact-us') return DEFAULT_SYSTEM_PAGES['contact'];
          if (s === 'contact') return DEFAULT_SYSTEM_PAGES['contact-us'];
          if (s === 'about-us') return DEFAULT_SYSTEM_PAGES['about-us'] || DEFAULT_SYSTEM_PAGES['about'];
          if (s === 'about') return DEFAULT_SYSTEM_PAGES['about-us'] || DEFAULT_SYSTEM_PAGES['about'];
          return null;
        };

        if (!res || !res.isPublished) {
          const fallback = resolveFallback(normalizedSlug);
          if (fallback) {
            setPage(fallback);
          } else {
            setNotFound(true);
          }
        } else {
          setPage(res);
        }
      } catch {
        const resolveFallback = (s: string) => {
          if (DEFAULT_SYSTEM_PAGES[s]) return DEFAULT_SYSTEM_PAGES[s];
          if (s === 'contact-us') return DEFAULT_SYSTEM_PAGES['contact'];
          if (s === 'contact') return DEFAULT_SYSTEM_PAGES['contact-us'];
          if (s === 'about-us') return DEFAULT_SYSTEM_PAGES['about-us'] || DEFAULT_SYSTEM_PAGES['about'];
          if (s === 'about') return DEFAULT_SYSTEM_PAGES['about-us'] || DEFAULT_SYSTEM_PAGES['about'];
          return null;
        };
        const fallback = resolveFallback(normalizedSlug);
        if (fallback) {
          setPage(fallback);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [slug]);

  useEffect(() => {
    if (page) {
      document.title = page.seoTitle || `${page.title} - ${settings.site_name || 'TikSavePro'}`;
    }
  }, [page, settings]);

  if (loading) {
    return (
      <main className="min-h-screen max-w-4xl mx-auto px-4 py-20 pt-28 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-text-secondary text-sm">Prerendering content...</span>
      </main>
    );
  }

  if (notFound || !page) {
    return (
      <main className="min-h-screen max-w-4xl mx-auto px-4 py-20 pt-28 text-center space-y-4">
        <HelpCircle className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-text-secondary">The requested page doesn't exist or is currently restricted.</p>
        <Link href="/" className="text-primary-400 hover:underline font-bold inline-block">← Back to Home</Link>
      </main>
    );
  }

  // Parse JSON layout blocks
  let blocks: any[] = [];
  try {
    blocks = JSON.parse(page.layout);
  } catch {
    blocks = [];
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      {/* Dynamic SEO Meta elements injection */}
      {page.seoDescription && <meta name="description" content={page.seoDescription} />}
      {page.seoKeywords && <meta name="keywords" content={page.seoKeywords} />}

      {/* Ad slot (Top) */}
      <div className="max-w-5xl mx-auto px-4">
        <AdSlot placement="header" settings={settings} />
      </div>

      <article className="max-w-5xl mx-auto px-4 mt-6">
        <div className="glass-panel overflow-hidden rounded-2xl shadow-xl border border-white/5 bg-slate-950/20 backdrop-blur-xl">
          {blocks.map((block: any, idx: number) => {
            if (block.type === 'hero') {
              const bgImage = block.bgImage || '/contact-banner.jpg';
              return (
                <div 
                  key={block.id || idx} 
                  className="p-8 sm:p-14 md:p-20 text-center space-y-4 border-b border-white/5 relative overflow-hidden bg-cover bg-center"
                  style={{ 
                    backgroundColor: '#0f172a',
                    backgroundImage: `url(${bgImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90 backdrop-blur-[1px] pointer-events-none" />
                  <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                    {block.badge && (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-1 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        {block.badge}
                      </div>
                    )}
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight break-words tracking-tight drop-shadow-md">{block.title}</h1>
                    <p className="text-white/85 text-sm md:text-lg max-w-2xl mx-auto break-words leading-relaxed drop-shadow">{block.subtitle}</p>

                    {(block.ctaText || block.secondaryCtaText) && (
                      <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                        {block.ctaText && (
                          <Link 
                            href={block.ctaLink || '/'} 
                            className="btn-primary px-6 py-3 rounded-xl font-bold text-sm md:text-base inline-flex items-center gap-2 shadow-lg shadow-primary-500/25 transition-transform hover:scale-105"
                          >
                            {block.ctaText}
                          </Link>
                        )}
                        {block.secondaryCtaText && (
                          <Link 
                            href={block.secondaryCtaLink || '/video'} 
                            className="px-6 py-3 rounded-xl font-bold text-sm md:text-base bg-white/10 hover:bg-white/15 text-white border border-white/15 inline-flex items-center gap-2 transition-all hover:scale-105"
                          >
                            {block.secondaryCtaText}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (block.type === 'downloader_tool') {
              return <VideoDownloader key={block.id || idx} />;
            }

            if (block.type === 'audio_tool') {
              return <AudioDownloader key={block.id || idx} />;
            }

            if (block.type === 'bulk_tool') {
              return <BulkDownloader key={block.id || idx} />;
            }

            if (block.type === 'apk_tool') {
              return <ApkDownloader key={block.id || idx} />;
            }

            if (block.type === 'contact_tool') {
              return <ContactFormTool key={block.id || idx} />;
            }

            if (block.type === 'heading') {
              const Tag: any = block.level || 'h2';
              const sizeClass = 
                Tag === 'h1' ? 'text-2xl md:text-4xl font-black' : 
                Tag === 'h2' ? 'text-xl md:text-3xl font-extrabold' : 
                'text-lg md:text-2xl font-bold';
              
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 pt-8 pb-2">
                  <Tag className={`${sizeClass} text-white break-words`}>{block.text}</Tag>
                </div>
              );
            }

            if (block.type === 'paragraph') {
              const formatParagraphWithLinks = (content: string) => {
                if (!content) return null;
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                const parts: React.ReactNode[] = [];
                let lastIndex = 0;
                let match;

                while ((match = linkRegex.exec(content)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push(content.substring(lastIndex, match.index));
                  }
                  const label = match[1];
                  const href = match[2];
                  const isInternal = href.startsWith('/') || href.startsWith('#');
                  if (isInternal) {
                    parts.push(
                      <Link key={match.index} href={href} className="text-primary-400 font-semibold hover:underline">
                        {label}
                      </Link>
                    );
                  } else {
                    parts.push(
                      <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="text-primary-400 font-semibold hover:underline">
                        {label}
                      </a>
                    );
                  }
                  lastIndex = linkRegex.lastIndex;
                }
                if (lastIndex < content.length) {
                  parts.push(content.substring(lastIndex));
                }
                return parts;
              };

              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-2">
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {formatParagraphWithLinks(block.text)}
                  </p>
                </div>
              );
            }

            if (block.type === 'cards_grid' && Array.isArray(block.items)) {
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {block.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary-500/30 transition-all flex flex-col justify-between space-y-4">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                            {item.badge && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/25 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                        </div>
                        {item.ctaText && item.ctaLink && (
                          <div>
                            <Link href={item.ctaLink} className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors">
                              {item.ctaText} →
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (block.type === 'steps' && Array.isArray(block.items)) {
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {block.items.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center font-black text-primary-400 text-lg">
                          {step.number || sIdx + 1}
                        </div>
                        <h3 className="text-base font-bold text-white">{step.title}</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (block.type === 'faq' && Array.isArray(block.items)) {
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-4 space-y-3">
                  {block.items.map((item: any, fIdx: number) => (
                    <details key={fIdx} className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 open:border-primary-500/25 open:bg-white/[0.04] transition-all">
                      <summary className="font-bold text-white text-sm sm:text-base cursor-pointer list-none flex items-center justify-between gap-3">
                        <span>{item.question}</span>
                        <span className="text-primary-400 text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
                      </summary>
                      <p className="text-text-secondary text-sm leading-relaxed mt-3 pt-3 border-t border-white/5 whitespace-pre-wrap">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              );
            }

            if (block.type === 'cta_box') {
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-6">
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary-950/40 via-purple-950/30 to-slate-900/60 border border-primary-500/20 text-center space-y-4">
                    <h3 className="text-xl md:text-2xl font-black text-white">{block.title}</h3>
                    <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">{block.subtitle}</p>
                    {block.buttonText && block.buttonLink && (
                      <div className="pt-2">
                        <Link href={block.buttonLink} className="btn-primary px-6 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-primary-500/20">
                          {block.buttonText} →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (block.type === 'image') {
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-4 flex flex-col items-center">
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg max-w-2xl w-full">
                    <img src={block.url} alt={block.caption || 'Page Image'} className="w-full h-auto object-cover max-h-[450px]" />
                  </div>
                  {block.caption && (
                    <span className="text-xs text-text-secondary mt-2 italic font-semibold break-words">{block.caption}</span>
                  )}
                </div>
              );
            }

            if (block.type === 'spacer') {
              return (
                <div key={block.id || idx} style={{ height: block.height || '30px' }} />
              );
            }

            return null;
          })}
        </div>
      </article>

      {/* Ad slot (Bottom) */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <AdSlot placement="footer" settings={settings} />
      </div>
    </main>
  );
}
