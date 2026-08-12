'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { useSettings } from '@/hooks/useSettings';

export default function AdSenseScriptLoader() {
  const { settings, loading } = useSettings();

  const isEnabled = settings.adsense_enabled === 'true';
  const publisherId = settings.adsense_publisher_id;
  const verificationCode = settings.adsense_verification_code;

  useEffect(() => {
    if (loading || !isEnabled || !publisherId || !verificationCode) return;

    // Direct DOM injection of head elements like site meta codes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = verificationCode;
    const nodes = Array.from(tempDiv.childNodes);
    const addedNodes: ChildNode[] = [];

    nodes.forEach(node => {
      // Avoid inserting duplicates of identical meta nodes or tag properties
      const isMeta = node.nodeName === 'META';
      if (isMeta) {
        const nameAttr = (node as HTMLElement).getAttribute('name');
        if (nameAttr && document.head.querySelector(`meta[name="${nameAttr}"]`)) return;
        const propAttr = (node as HTMLElement).getAttribute('property');
        if (propAttr && document.head.querySelector(`meta[property="${propAttr}"]`)) return;
      }
      
      const clone = node.cloneNode(true);
      document.head.appendChild(clone);
      addedNodes.push(clone as ChildNode);
    });

    return () => {
      // Cleanup appended elements on unmount or properties change
      addedNodes.forEach(node => {
        try {
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        } catch (_) {}
      });
    };
  }, [loading, isEnabled, publisherId, verificationCode]);

  if (loading || !isEnabled || !publisherId) return null;

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
