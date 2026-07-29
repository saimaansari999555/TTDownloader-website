'use client';
import CustomPage from '@/app/p/[slug]/page';
export default function Home() {
  return <CustomPage params={{ slug: 'home' }} />;
}
