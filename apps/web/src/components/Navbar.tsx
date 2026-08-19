'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Download, Music, Users, Menu, X, ArrowRight, Sparkles, FileText, Mail, HelpCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { DEFAULT_NAVBAR_CONFIG, NavbarConfig } from '@/components/admin/NavbarManager';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const { settings } = useSettings();

  const config: NavbarConfig = useMemo(() => {
    if (settings['navbar_config']) {
      try {
        const parsed = JSON.parse(settings['navbar_config']);
        return { ...DEFAULT_NAVBAR_CONFIG, ...parsed };
      } catch {
        return DEFAULT_NAVBAR_CONFIG;
      }
    }
    return DEFAULT_NAVBAR_CONFIG;
  }, [settings]);

  if (config.enabled === false) {
    return null;
  }

  const activeMenuItems = (config.menuItems || DEFAULT_NAVBAR_CONFIG.menuItems).filter(
    (item) => item.isActive !== false
  );

  const logoText = config.logo?.text || 'TikSavePro';
  const logoHighlight = config.logo?.highlightText || 'SavePro';
  const logoBase = logoText.replace(logoHighlight, '');

  const getIconForUrl = (url: string) => {
    if (url === '/video' || url === '/') return Download;
    if (url === '/audio') return Music;
    if (url === '/bulk') return Users;
    if (url === '/blog') return FileText;
    if (url === '/contact-us') return Mail;
    return null;
  };

  return (
    <header className={`${config.sticky !== false ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-50'}`}>
      {/* Announcement Bar */}
      {config.announcement?.enabled && !announcementDismissed && (
        <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-between shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-1 text-center">
            <span>{config.announcement.message}</span>
            {config.announcement.linkText && config.announcement.linkUrl && (
              <Link
                href={config.announcement.linkUrl}
                className="underline hover:text-white/80 transition-opacity font-bold inline-flex items-center gap-1 ml-1"
              >
                {config.announcement.linkText} <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          {config.announcement.dismissible && (
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <div className="glass-panel rounded-none border-x-0 border-t-0 px-4 sm:px-6 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href={config.logo?.link || '/'} className="flex items-center gap-2.5">
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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeMenuItems.map((item) => {
              const Icon = getIconForUrl(item.url);
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.id || item.url}
                  href={item.url}
                  target={item.target || '_self'}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-400 bg-primary-500/10 font-semibold'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {item.label}
                </Link>
              );
            })}

            {/* Header CTA Button */}
            {config.cta?.enabled && config.cta.text && (
              <div className="ml-3 pl-3 border-l border-white/10">
                <Link
                  href={config.cta.url || '/video'}
                  target={config.cta.target || '_self'}
                  className="btn-primary rounded-xl px-4 py-2 text-xs font-bold shadow-lg inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  {config.cta.text}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 pb-2 space-y-1 border-t border-white/10 pt-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {activeMenuItems.map((item) => {
              const Icon = getIconForUrl(item.url);
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.id || item.url}
                  href={item.url}
                  target={item.target || '_self'}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'text-primary-400 bg-primary-500/10 font-bold'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            {config.cta?.enabled && config.cta.text && (
              <div className="pt-2 px-2">
                <Link
                  href={config.cta.url || '/video'}
                  target={config.cta.target || '_self'}
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary rounded-xl py-3 px-4 text-xs font-bold shadow-lg flex items-center justify-center gap-2 w-full"
                >
                  <Download className="w-4 h-4" />
                  {config.cta.text}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
