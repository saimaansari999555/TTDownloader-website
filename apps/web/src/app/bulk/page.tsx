'use client';
import CustomPage from '@/app/p/[slug]/page';
export default function BulkPage() {
  return <CustomPage params={{ slug: 'bulk' }} />;
}
