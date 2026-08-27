'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { useSettings } from '@/hooks/useSettings';

/**
 * AnalyticsInjector
 * Reads analytics/webmaster settings and injects:
 *   1. Google Analytics GA4 gtag.js script
 *   2. Google Search Console verification <meta> tag
 *   3. Ahrefs site verification <meta> tag
 */
export default function AnalyticsInjector() {
  const { settings, loading } = useSettings();

  const gaId = settings['google_analytics']?.trim();
  const gscToken = settings['google_search_console']?.trim();
  const ahrefsToken = settings['ahrefs_verification']?.trim();

  // Inject/remove Google Search Console verification meta tag
  useEffect(() => {
    if (loading) return;
    const META_ID = 'gsc-verification-meta';
    let existing = document.getElementById(META_ID) as HTMLMetaElement | null;

    if (gscToken) {
      if (!existing) {
        existing = document.createElement('meta') as HTMLMetaElement;
        existing.id = META_ID;
        document.head.appendChild(existing);
      }
      existing.setAttribute('name', 'google-site-verification');
      existing.setAttribute('content', gscToken);
    } else if (existing) {
      existing.remove();
    }
  }, [loading, gscToken]);

  // Inject/remove Ahrefs verification meta tag
  useEffect(() => {
    if (loading) return;
    const META_ID = 'ahrefs-verification-meta';
    let existing = document.getElementById(META_ID) as HTMLMetaElement | null;

    if (ahrefsToken) {
      if (!existing) {
        existing = document.createElement('meta') as HTMLMetaElement;
        existing.id = META_ID;
        document.head.appendChild(existing);
      }
      existing.setAttribute('name', 'ahrefs-site-verification');
      existing.setAttribute('content', ahrefsToken);
    } else if (existing) {
      existing.remove();
    }
  }, [loading, ahrefsToken]);

  if (loading || !gaId) return null;

  return (
    <>
      {/* Google tag (gtag.js) - GA4 */}
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
