'use client';
import CustomPage from '@/app/p/[slug]/page';
export default function AboutPage() {
  return <CustomPage params={{ slug: 'about' }} />;
}
