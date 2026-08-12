'use client';
import { useEffect, useRef } from 'react';
import GoogleAdSense from './GoogleAdSense';

interface AdSlotProps {
  placement?: 'header' | 'result' | 'footer' | 'sidebar';
  settings?: Record<string, string>;
  html?: string; // Backwards compatibility fallback if placement and settings are not passed
}

export default function AdSlot({ placement, settings, html }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isAdSenseEnabled = settings?.adsense_enabled === 'true';
  const publisherId = settings?.adsense_publisher_id;
  
  let adSlotId = '';
  let fallbackHtml = html || '';

  if (placement && settings) {
    if (placement === 'header') {
      adSlotId = settings.adsense_header_slot || '';
      fallbackHtml = settings.ad_top_code || '';
    } else if (placement === 'result') {
      adSlotId = settings.adsense_download_slot || '';
      fallbackHtml = settings.ad_result_code || '';
    } else if (placement === 'footer') {
      adSlotId = settings.adsense_footer_slot || '';
      fallbackHtml = settings.ad_bottom_code || '';
    } else if (placement === 'sidebar') {
      adSlotId = settings.adsense_sidebar_slot || '';
      fallbackHtml = settings.ad_sidebar_code || '';
    }
  }

  const renderAdSense = !!(isAdSenseEnabled && publisherId && adSlotId);

  useEffect(() => {
    if (renderAdSense) return;
    if (!fallbackHtml || !containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // Create a temporary div to parse the HTML string
    const range = document.createRange();
    const documentFragment = range.createContextualFragment(fallbackHtml);

    // Contextual fragment correctly handles and runs scripts inside the fragment when appended
    containerRef.current.appendChild(documentFragment);
  }, [renderAdSense, fallbackHtml]);

  if (renderAdSense) {
    return (
      <GoogleAdSense
        publisherId={publisherId!}
        adSlot={adSlotId}
        adFormat={settings?.adsense_ad_format}
        fullWidthResponsive={settings?.adsense_full_width_responsive !== 'false'}
      />
    );
  }

  if (!fallbackHtml) return null;

  return (
    <div className="w-full overflow-hidden flex justify-center my-6">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}
