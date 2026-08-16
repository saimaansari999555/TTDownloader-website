import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'About Us | Tik-TokDownloader.xyz',
  description: 'Learn about Tik-TokDownloader.xyz, our TikTok video, MP3, audio extraction and bulk download tools, and our commitment to a simple and responsible browsing experience.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/about',
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
    title: 'About Us | Tik-TokDownloader.xyz',
    description: 'Learn about Tik-TokDownloader.xyz, our TikTok video, MP3, audio extraction and bulk download tools, and our commitment to a simple and responsible browsing experience.',
    url: 'https://tik-tokdownloader.xyz/about',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'About Us | Tik-TokDownloader.xyz',
    description: 'Learn about Tik-TokDownloader.xyz, our tools, and platform goals.',
  },
};

export default function AboutPage() {
  return <CustomPage params={{ slug: 'about' }} />;
}
