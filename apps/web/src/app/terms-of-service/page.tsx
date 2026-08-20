import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'Terms of Service | TikSavePro',
  description:
    'Read the TikSavePro Terms of Service to understand the rules, responsibilities, copyright considerations, advertising, and conditions for using our website and tools.',
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/terms-of-service',
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
    title: 'Terms of Service | TikSavePro',
    description:
      'Read the TikSavePro Terms of Service to understand the rules, responsibilities, copyright considerations, advertising, and conditions for using our website and tools.',
    url: 'https://tik-tokdownloader.xyz/terms-of-service',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | TikSavePro',
    description:
      'Read the TikSavePro Terms of Service to understand rules, copyright considerations, and conditions for using our website and tools.',
  },
};

export default function TermsOfServicePage() {
  return <CustomPage params={{ slug: 'terms-of-service' }} />;
}
