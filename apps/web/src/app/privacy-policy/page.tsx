import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'Privacy Policy | TikSavePro',
  description:
    'Read the TikSavePro Privacy Policy to learn how information, cookies, advertising technologies, and third-party services may be used when you visit our website.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/privacy-policy',
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
    title: 'Privacy Policy | TikSavePro',
    description:
      'Read the TikSavePro Privacy Policy to learn how information, cookies, advertising technologies, and third-party services may be used when you visit our website.',
    url: 'https://tik-tokdownloader.xyz/privacy-policy',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | TikSavePro',
    description:
      'Read the TikSavePro Privacy Policy to learn how information, cookies, and advertising technologies are handled.',
  },
};

export default function PrivacyPolicyPage() {
  return <CustomPage params={{ slug: 'privacy-policy' }} />;
}
