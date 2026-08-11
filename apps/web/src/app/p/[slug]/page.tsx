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
    seoTitle: 'TTDownloader - Download TikTok Videos Without Watermark',
    seoDescription: 'Download TikTok videos without watermark in HD quality for free.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'h-1', type: 'hero', title: 'Download TikTok Videos Without Watermark', subtitle: 'Fast, free, and completely ad-free. Just paste the link and get your video.', bgColor: '#8b5cf6' },
      { id: 'h-2', type: 'downloader_tool' }
    ])
  },
  video: {
    title: 'TikTok Video Downloader',
    seoTitle: 'TikTok Video Downloader - TTDownloader',
    seoDescription: 'Download HD videos without watermark in MP4 format.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'v-1', type: 'hero', title: 'TikTok Video Downloader', subtitle: 'Download HD videos without watermark in MP4 format.', bgColor: '#3b82f6' },
      { id: 'v-2', type: 'downloader_tool' }
    ])
  },
  audio: {
    title: 'TikTok Audio Extractor',
    seoTitle: 'TikTok Audio Extractor - TTDownloader',
    seoDescription: 'Extract and download MP3 audio from any TikTok video.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'au-1', type: 'hero', title: 'TikTok Audio Extractor', subtitle: 'Extract and download MP3 audio from any TikTok video.', bgColor: '#ec4899' },
      { id: 'au-2', type: 'audio_tool' }
    ])
  },
  bulk: {
    title: 'TikTok Profile Bulk Downloader',
    seoTitle: 'TikTok Profile Bulk Downloader - TTDownloader',
    seoDescription: 'Enter any TikTok username to fetch and download all their videos at once.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'b-1', type: 'hero', title: 'TikTok Profile Bulk Downloader', subtitle: 'Enter any TikTok username to fetch and download all their videos at once.', bgColor: '#10b981' },
      { id: 'b-2', type: 'bulk_tool' }
    ])
  },
  apk: {
    title: 'Download Our Android App',
    seoTitle: 'Android APK Release - TTDownloader',
    seoDescription: 'Download the TTDownloader Android app.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'ap-1', type: 'hero', title: 'Download Our Android App', subtitle: 'Get the TTDownloader Android app and download TikTok videos directly.', bgColor: '#f59e0b' },
      { id: 'ap-2', type: 'apk_tool' }
    ])
  },
  about: {
    title: 'About Us Page',
    seoTitle: 'About Us - TTDownloader',
    seoDescription: 'Welcome to Tik-TokDownloader.xyz, a simple and user-friendly online platform designed to make downloading and saving publicly available TikTok content easier.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'ab-1', type: 'hero', title: 'About Us', subtitle: 'Welcome to Tik-TokDownloader.xyz, a simple and user-friendly online platform designed to make downloading and saving publicly available TikTok content easier.', bgColor: '#1e293b' },
      { id: 'ab-2', type: 'paragraph', text: 'Our goal is to provide useful tools that allow users to work with TikTok video links directly from their web browser. Whether you want to download a single video, process multiple videos, or extract audio from supported content, our tools are designed to keep the process simple and convenient.' },
      { id: 'ab-3', type: 'heading', level: 'h2', text: 'What Is Tik-TokDownloader.xyz?' },
      { id: 'ab-4', type: 'paragraph', text: 'Tik-TokDownloader.xyz is an online platform built for users who want a convenient way to work with TikTok video content without installing complicated software.\n\nTikTok contains millions of entertaining, educational, informative, and creative videos. Sometimes users want to save a video for offline viewing, keep a useful tutorial, save audio for personal use, or process multiple video links at once.\n\nOur platform provides several browser-based tools to make these tasks easier.' },
      { id: 'ab-5', type: 'heading', level: 'h2', text: 'Our Main Tools' },
      { id: 'ab-6', type: 'heading', level: 'h3', text: 'TikTok Video Downloader' },
      { id: 'ab-7', type: 'paragraph', text: 'Our main TikTok Video Downloader allows users to process a publicly available TikTok video link and access the available download options.\n\nThe process is simple:\n\n1. Find a TikTok video.\n2. Copy its link.\n3. Paste the link into our downloader.\n4. Start the download.\n5. Save the available video to your device.\n\nThe available quality depends on the source video and the options available at the time of processing.' },
      { id: 'ab-8', type: 'heading', level: 'h3', text: 'TikTok Audio Extractor' },
      { id: 'ab-9', type: 'paragraph', text: 'Sometimes you may be interested in the audio from a TikTok video rather than the complete video.\n\nOur Audio Extractor is designed to provide a convenient way to extract available audio from supported TikTok video content.\n\nThis can be useful for users who want to listen to audio separately or keep audio for personal offline use.\n\nThe available audio quality depends on the source content and the processing options provided by the service.' },
      { id: 'ab-10', type: 'heading', level: 'h3', text: 'TikTok MP3 Downloader' },
      { id: 'ab-11', type: 'paragraph', text: 'For users who specifically want audio files, our TikTok MP3 Downloader provides a simple browser-based option for converting supported TikTok video content into an audio format.\n\nInstead of downloading the complete video, users can use the available audio option when supported.\n\nThis can be useful when you are interested in the sound, music, spoken content, or other audio contained in a TikTok video.' },
      { id: 'ab-12', type: 'heading', level: 'h3', text: 'TikTok Bulk Downloader' },
      { id: 'ab-13', type: 'paragraph', text: 'Downloading videos one at a time can become inconvenient when you have several links to process.\n\nThat\'s why we also provide a TikTok Bulk Downloader feature for users who need to work with multiple TikTok video URLs.\n\nInstead of processing every link individually, the bulk downloading feature is designed to make handling multiple URLs more convenient.\n\nUsers can provide multiple supported TikTok links and process them through the available bulk downloading options.\n\nThe actual availability and number of videos that can be processed may depend on the current service limitations and source content.' },
      { id: 'ab-14', type: 'heading', level: 'h2', text: 'Why We Built These Tools' },
      { id: 'ab-15', type: 'paragraph', text: 'Our goal is to reduce unnecessary complexity.\n\nMany online tools can be confusing, require unnecessary registrations, or ask users to install additional applications. We believe a useful online tool should be straightforward and accessible.\n\nThat\'s why Tik-TokDownloader.xyz focuses on:\n\n* Simple browser-based tools\n* Easy-to-understand interfaces\n* Mobile-friendly access\n* Support for different downloading needs\n* No unnecessary software installation\n* Convenient processing of supported TikTok links' },
      { id: 'ab-16', type: 'heading', level: 'h2', text: 'Designed for Mobile and Desktop Users' },
      { id: 'ab-17', type: 'paragraph', text: 'TikTok is primarily used on smartphones, so we understand the importance of a mobile-friendly experience.\n\nTik-TokDownloader.xyz can be accessed through modern browsers on:\n\n* Android phones\n* iPhones\n* Tablets\n* Windows computers\n* Mac computers\n* Other supported devices\n\nYou don\'t need to use a specific operating system to access our online tools. Simply open the website through a compatible browser and use the tool you need.' },
      { id: 'ab-18', type: 'heading', level: 'h2', text: 'How Our Platform Works' },
      { id: 'ab-19', type: 'paragraph', text: 'Our tools are designed around a simple URL-based workflow.\n\nYou provide a supported TikTok video link, and the relevant tool processes the available information associated with that URL. Depending on the tool you choose, you may then receive options for downloading the video, processing multiple videos, or extracting available audio.\n\nBecause the source content can vary, download formats, quality, and availability may not be identical for every video.' },
      { id: 'ab-20', type: 'heading', level: 'h2', text: 'Privacy and Security' },
      { id: 'ab-21', type: 'paragraph', text: 'We believe users should always be careful when using online downloading services.\n\nTik-TokDownloader.xyz does not require users to provide their TikTok password to use the downloader tools. We strongly recommend that users never share their TikTok login credentials with third-party downloading websites.\n\nYou should also avoid downloading unknown software, suspicious browser extensions, or files from websites that you do not trust.\n\nFor complete information about privacy and data handling, please visit our Privacy Policy page.' },
      { id: 'ab-22', type: 'heading', level: 'h2', text: 'Respecting Content Creators' },
      { id: 'ab-23', type: 'paragraph', text: 'TikTok videos, music, sounds, and other content may be protected by copyright or other intellectual property rights.\n\nDownloading a video or extracting its audio does not transfer ownership of that content to you.\n\nWe encourage all users to respect the original creators and rights holders. If you intend to repost, redistribute, modify, publish, or use downloaded content for commercial purposes, make sure you have the necessary permission and comply with applicable copyright laws and platform rules.\n\nOur tools are intended to provide technical functionality for supported content and should be used responsibly.' },
      { id: 'ab-24', type: 'heading', level: 'h2', text: 'Our Commitment to a Better Experience' },
      { id: 'ab-25', type: 'paragraph', text: 'We are continuously working to improve Tik-TokDownloader.xyz and make our tools easier and more convenient to use.\n\nAs the needs of TikTok users change, we may introduce improvements to our existing Video Downloader, Audio Extractor, MP3 Downloader, and Bulk Downloader tools.\n\nOur aim is to keep the platform simple while providing useful features for users around the world.' },
      { id: 'ab-26', type: 'heading', level: 'h2', text: 'Have a Question or Suggestion?' },
      { id: 'ab-27', type: 'paragraph', text: 'We value feedback from our visitors.\n\nIf you experience a problem, have a question about one of our tools, or have an idea that could improve the website, you can contact us through our Contact Us page.\n\nUser feedback helps us identify areas where the website can be improved and helps us build a better experience.' },
      { id: 'ab-28', type: 'heading', level: 'h2', text: 'Thank You for Visiting' },
      { id: 'ab-29', type: 'paragraph', text: 'Thank you for visiting Tik-TokDownloader.xyz.\n\nWhether you need to download a single TikTok video, process multiple links with our Bulk Downloader, extract audio, or use our MP3 Downloader, we aim to provide simple browser-based tools that are easy to access and use.\n\nTik-TokDownloader.xyz — Simple and convenient tools for working with supported TikTok content.' }
    ])
  },
  contact: {
    title: 'Contact Us Page',
    seoTitle: 'Contact Us - TTDownloader',
    seoDescription: 'Get in touch with the support team.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'c-1', type: 'hero', title: 'Get In Touch', subtitle: "Have a question, suggestion, or need support? We'd love to hear from you.", bgColor: '#0f172a' },
      { id: 'c-2', type: 'contact_tool' }
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
    // Check if params is a Promise
    if (params instanceof Promise) {
      params.then((res: any) => setSlug(res?.slug || null));
    } else if (typeof (params as any).then === 'function') {
      (params as any).then((res: any) => setSlug(res?.slug || null));
    } else {
      setSlug(params.slug || null);
    }
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getCustomPageBySlug(slug)
      .then(res => {
        if (!res || !res.isPublished) {
          if (DEFAULT_SYSTEM_PAGES[slug]) {
            setPage(DEFAULT_SYSTEM_PAGES[slug]);
          } else {
            setNotFound(true);
          }
        } else {
          setPage(res);
        }
      })
      .catch(() => {
        if (DEFAULT_SYSTEM_PAGES[slug]) {
          setPage(DEFAULT_SYSTEM_PAGES[slug]);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (page) {
      document.title = page.seoTitle || `${page.title} - ${settings.site_name || 'TTDownloader'}`;
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
        <AdSlot html={settings.ad_top_code} />
      </div>

      <article className="max-w-5xl mx-auto px-4 mt-6">
        <div className="glass-panel overflow-hidden rounded-2xl shadow-xl border border-white/5 bg-slate-950/20 backdrop-blur-xl">
          {blocks.map((block: any, idx: number) => {
            if (block.type === 'hero') {
              return (
                <div 
                  key={block.id || idx} 
                  className="p-6 sm:p-10 md:p-16 text-center space-y-4 border-b border-white/5 relative"
                  style={{ backgroundColor: block.bgColor || '#1e293b' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
                  <div className="relative z-10 space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight break-words">{block.title}</h1>
                    <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto break-words">{block.subtitle}</p>
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
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 pt-6">
                  <Tag className={`${sizeClass} text-white break-words`}>{block.text}</Tag>
                </div>
              );
            }

            if (block.type === 'paragraph') {
              return (
                <div key={block.id || idx} className="px-4 sm:px-8 md:px-12 py-3">
                  <p className="text-text-secondary text-sm md:text-lg leading-relaxed whitespace-pre-wrap break-words">{block.text}</p>
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
        <AdSlot html={settings.ad_bottom_code} />
      </div>
    </main>
  );
}
