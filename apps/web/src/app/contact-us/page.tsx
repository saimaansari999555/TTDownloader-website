import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'Contact Us - TTDownloader',
  description: 'Get in touch with the TTDownloader support team. Have questions, feedback, downloader issue reports, or partnership inquiries? Send us a message anytime.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/contact-us',
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
    title: 'Contact Us - TTDownloader',
    description: 'Get in touch with the TTDownloader support team for questions, feedback, and downloader assistance.',
    url: 'https://tik-tokdownloader.xyz/contact-us',
    type: 'website',
    siteName: 'TTDownloader',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us - TTDownloader',
    description: 'Get in touch with the TTDownloader support team.',
  },
};

export default function ContactUsPage() {
  return <CustomPage params={{ slug: 'contact-us' }} />;
}
