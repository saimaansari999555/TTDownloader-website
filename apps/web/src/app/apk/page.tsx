import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'TikSavePro Android App – Coming Soon | TikTok Downloader',
  description:
    'Learn about the upcoming TikSavePro Android app and use our browser-based TikTok video, audio, MP3 and bulk downloader tools on Android today.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/apk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'TikSavePro Android App – Coming Soon | TikTok Downloader',
    description:
      'Learn about the upcoming TikSavePro Android app and use our browser-based TikTok video, audio, MP3 and bulk downloader tools on Android today.',
    url: 'https://tik-tokdownloader.xyz/apk',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'TikSavePro Android App – Coming Soon',
    description:
      'Learn about the upcoming TikSavePro Android app and use our browser-based TikTok downloader tools on Android today.',
  },
};

export default function ApkPage() {
  return <CustomPage params={{ slug: 'apk' }} />;
}
