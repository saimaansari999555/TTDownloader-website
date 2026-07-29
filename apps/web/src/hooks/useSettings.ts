'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        const map: Record<string, string> = {};
        res.data.forEach((s: any) => {
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
