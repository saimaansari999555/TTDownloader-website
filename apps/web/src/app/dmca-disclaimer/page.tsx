import type { Metadata } from 'next';
import CustomPage from '@/app/p/[slug]/page';

export const metadata: Metadata = {
  title: 'DMCA & Disclaimer | TikSavePro',
  description:
    "Learn about TikSavePro's copyright, DMCA notice process, content-use responsibilities, third-party services, and website disclaimers.",
  alternates: {
    canonical: 'https://tik-tokdownloader.xyz/dmca-disclaimer',
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
    title: 'DMCA & Disclaimer | TikSavePro',
    description:
      "Learn about TikSavePro's copyright, DMCA notice process, content-use responsibilities, third-party services, and website disclaimers.",
    url: 'https://tik-tokdownloader.xyz/dmca-disclaimer',
    type: 'website',
    siteName: 'TikSavePro',
  },
  twitter: {
    card: 'summary',
    title: 'DMCA & Disclaimer | TikSavePro',
    description:
      "Learn about TikSavePro's copyright, DMCA notice process, and website disclaimers.",
  },
};

export default function DmcaDisclaimerPage() {
  return <CustomPage params={{ slug: 'dmca-disclaimer' }} />;
}
