'use client';
import { useEffect, useRef } from 'react';

interface GoogleAdSenseProps {
  publisherId: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function GoogleAdSense({
  publisherId,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}: GoogleAdSenseProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple push calls to adsbygoogle on the same DOM container element
    if (initialized.current) return;
    initialized.current = true;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('AdSense adsbygoogle push initialization failed:', err);
    }
  }, [adSlot]);

  return (
    <div className={`w-full overflow-hidden flex justify-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', width: '100%' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
