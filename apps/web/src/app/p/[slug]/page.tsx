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
          setNotFound(true);
        } else {
          setPage(res);
        }
      })
      .catch(() => setNotFound(true))
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
