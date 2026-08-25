import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'TikTok Audio Extractor – Download MP3 Sounds | TikSavePro',
  description:
    'Extract and download TikTok audio & MP3 songs in high quality for free. Fast, safe, and works on all devices directly from your web browser with TikSavePro.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/audio-extractor',
  },
  openGraph: {
    title: 'TikTok Audio Extractor – Download MP3 Sounds | TikSavePro',
    description:
      'Extract and download TikTok audio & MP3 songs in high quality for free. Fast, safe, and works on all devices with TikSavePro.',
    url: 'https://tik-tokdownloader.xyz/audio-extractor',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'TikTok Audio Extractor – Download MP3 Sounds',
    description:
      'Extract and download TikTok audio & MP3 songs in high quality for free directly from your web browser.',
  },
};

export default function AudioExtractorPage() {
  return <CustomPage params={{ slug: 'audio-extractor' }} />;
}
