'use client';

import { useEffect } from 'react';
import { getActivePlugins } from '@/lib/api';

export default function PluginInjector() {
  useEffect(() => {
    getActivePlugins()
      .then((plugins: any[]) => {
        if (!Array.isArray(plugins)) return;

        plugins.forEach((plugin) => {
          // Inject Head Codes
          if (plugin.headCode && plugin.headCode.trim()) {
            injectScripts(plugin.headCode, document.head);
          }

          // Inject Footer Codes
          if (plugin.footerCode && plugin.footerCode.trim()) {
            injectScripts(plugin.footerCode, document.body);
          }
        });
      })
      .catch(() => {
        // Silently catch error if backend is not booted yet
      });
  }, []);

  const injectScripts = (htmlStr: string, parentNode: HTMLElement) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlStr;

    // Separate script tags from raw HTML
    const scripts = Array.from(tempDiv.querySelectorAll('script'));
    const nonScripts = Array.from(tempDiv.childNodes).filter((node) => node.nodeName !== 'SCRIPT');

    // Append non-script elements (e.g. style tags, floaters divs)
    nonScripts.forEach((node) => {
      parentNode.appendChild(node.cloneNode(true));
    });

    // Execute scripts dynamically
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Inline script code
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }

      parentNode.appendChild(newScript);
    });
  };

  return null; // Invisible component
}
