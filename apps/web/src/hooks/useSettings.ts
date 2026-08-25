'use client';
import { useEffect, useState, useCallback } from 'react';
import { getSettings } from '@/lib/api';

const SETTINGS_STORAGE_KEY = 'tiksave_settings_cache';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return {};
  });
  const [loading, setLoading] = useState(true);

  const applyCustomCss = (css: string) => {
    if (typeof document === 'undefined') return;
    let styleEl = document.getElementById('custom-site-styles');
    if (!styleEl && css) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-site-styles';
      document.head.appendChild(styleEl);
    }
    if (styleEl) {
      styleEl.innerHTML = css || '';
    }
  };

  const fetchFreshSettings = useCallback(async () => {
    try {
      const list = await getSettings();
      const serverMap: Record<string, string> = {};
      if (Array.isArray(list) && list.length > 0) {
        list.forEach((s: any) => {
          if (s && s.key !== undefined) {
            serverMap[s.key] = s.value;
          }
        });
      }

      let localMap: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
          if (cached) localMap = JSON.parse(cached);
        } catch {}
      }

      // Merge server defaults with user saved local settings (user settings take priority!)
      const merged = { ...serverMap, ...localMap };
      setSettings(merged);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        } catch {}
      }
      if (merged.custom_css) {
        applyCustomCss(merged.custom_css);
      }
    } catch {
      // Keep cached settings on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFreshSettings();

    const handleUpdate = () => {
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setSettings(parsed);
            if (parsed.custom_css) {
              applyCustomCss(parsed.custom_css);
            }
          }
        } catch {}
      }
      fetchFreshSettings();
    };

    window.addEventListener('tiksave_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('tiksave_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchFreshSettings]);

  return { settings, loading, refetch: fetchFreshSettings };
}
