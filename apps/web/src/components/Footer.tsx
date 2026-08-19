'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Download, Mail, Globe, Sparkles } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { DEFAULT_FOOTER_CONFIG, FooterConfig } from '@/components/admin/FooterManager';

export default function Footer() {
  const { settings } = useSettings();

  const config: FooterConfig = useMemo(() => {
    if (settings['footer_config']) {
      try {
        const parsed = JSON.parse(settings['footer_config']);
        return { ...DEFAULT_FOOTER_CONFIG, ...parsed };
      } catch {
        return DEFAULT_FOOTER_CONFIG;
      }
    }
    return DEFAULT_FOOTER_CONFIG;
  }, [settings]);

  if (config.enabled === false) {
    return null;
  }

  const logoText = config.logo?.text || 'TikSavePro';
  const logoHighlight = config.logo?.highlightText || 'SavePro';
  const logoBase = logoText.replace(logoHighlight, '');

  const currentYear = new Date().getFullYear();
  const renderedCopyright = (config.copyright || '© {year} TikSavePro. All rights reserved.').replace(
    '{year}',
    String(currentYear)
  );

  const columns = config.columns || DEFAULT_FOOTER_CONFIG.columns;
  const activeSocials = (config.socials || DEFAULT_FOOTER_CONFIG.socials).filter(
    (s) => s.isActive && s.url
  );

  const renderSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('mail') || p.includes('email')) {
      return <Mail className="w-5 h-5" />;
    }
    if (p.includes('x') || p.includes('twitter')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    }
    if (p.includes('youtube')) {
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    }
    return <Globe className="w-5 h-5" />;
  };

  return (
    <footer className="border-t border-white/5 mt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href={config.logo?.link || '/'} className="flex items-center gap-2">
              {config.logo?.imageUrl ? (
                <img
                  src={config.logo.imageUrl}
                  alt={config.logo.alt || logoText}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <Download className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-bold text-lg text-white">
                {logoBase}
                <span className="text-primary-400">{logoHighlight}</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              {config.description || DEFAULT_FOOTER_CONFIG.description}
            </p>
          </div>

          {/* Dynamic Columns */}
          {columns.map((column) => (
            <div key={column.id || column.title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.id || link.url}>
                    <Link
                      href={link.url}
                      target={link.target || '_self'}
                      className="text-text-secondary hover:text-primary-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">{renderedCopyright}</p>
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-4">
              {activeSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="text-text-secondary hover:text-white transition-colors p-1"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
