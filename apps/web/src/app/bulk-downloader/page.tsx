import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'TikTok Profile Bulk Downloader – Save Multiple Videos | TikSavePro',
  description:
    'Download multiple TikTok videos from any public profile at once without watermark in HD. Free, fast online TikTok bulk video downloader tool.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/bulk-downloader',
  },
  openGraph: {
    title: 'TikTok Profile Bulk Downloader – Save Multiple Videos | TikSavePro',
    description:
      'Download multiple TikTok videos from any public profile at once without watermark in HD.',
    url: 'https://tik-tokdownloader.xyz/bulk-downloader',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'TikTok Profile Bulk Downloader',
    description:
      'Download multiple TikTok videos from any public profile at once without watermark in HD.',
  },
};

export default function BulkDownloaderPage() {
  return <CustomPage params={{ slug: 'bulk-downloader' }} />;
}
