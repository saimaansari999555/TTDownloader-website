'use client';
import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/api';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(list => {
        const map: Record<string, string> = {};
        list.forEach((s: any) => {
          map[s.key] = s.value;
        });
        setSettings(map);
        
        // Dynamically inject custom CSS if defined
        if (map.custom_css) {
          let styleEl = document.getElementById('custom-site-styles');
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'custom-site-styles';
            document.head.appendChild(styleEl);
          }
          styleEl.innerHTML = map.custom_css;
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
