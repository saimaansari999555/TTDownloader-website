'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Megaphone,
  Download,
  Music,
  Users,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export interface NavItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  target?: '_self' | '_blank';
  isActive: boolean;
  submenu?: { id: string; label: string; url: string; target?: '_self' | '_blank' }[];
}

export interface NavbarConfig {
  enabled: boolean;
  sticky: boolean;
  announcement: {
    enabled: boolean;
    message: string;
    linkText: string;
    linkUrl: string;
    dismissible: boolean;
  };
  logo: {
    imageUrl: string;
    text: string;
    highlightText: string;
    alt: string;
    link: string;
  };
  menuItems: NavItem[];
  cta: {
    enabled: boolean;
    text: string;
    url: string;
    target: '_self' | '_blank';
  };
}

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  enabled: true,
  sticky: true,
  announcement: {
    enabled: false,
    message: '🔥 New: Download TikTok Videos & MP3 in Full HD without watermark!',
    linkText: 'Try Now',
    linkUrl: '/video',
    dismissible: true,
  },
  logo: {
    imageUrl: '',
    text: 'TikSavePro',
    highlightText: 'SavePro',
    alt: 'TikSavePro Logo',
    link: '/',
  },
  menuItems: [
    { id: 'm-1', label: 'Video Downloader', url: '/video', icon: 'Download', target: '_self', isActive: true },
    { id: 'm-2', label: 'Audio Extractor', url: '/audio', icon: 'Music', target: '_self', isActive: true },
    { id: 'm-3', label: 'Bulk Downloader', url: '/bulk', icon: 'Users', target: '_self', isActive: true },
    { id: 'm-4', label: 'Blog', url: '/blog', target: '_self', isActive: true },
    { id: 'm-5', label: 'Android APK', url: '/apk', target: '_self', isActive: true },
    { id: 'm-6', label: 'About', url: '/about-us', target: '_self', isActive: true },
    { id: 'm-7', label: 'Contact', url: '/contact-us', target: '_self', isActive: true },
  ],
  cta: {
    enabled: false,
    text: 'Download Video',
    url: '/video',
    target: '_self',
  },
};

const CMS_PAGE_PRESETS = [
  { label: 'Home Page', url: '/' },
  { label: 'Video Downloader', url: '/video' },
  { label: 'Audio Extractor', url: '/audio' },
  { label: 'Bulk Downloader', url: '/bulk' },
  { label: 'Android APK', url: '/apk' },
  { label: 'Blog Index', url: '/blog' },
  { label: 'About Us', url: '/about-us' },
  { label: 'Contact Us', url: '/contact-us' },
  { label: 'Privacy Policy', url: '/privacy-policy' },
];

interface Props {
  value: string;
  onChange: (newJson: string) => void;
}

export default function NavbarManager({ value, onChange }: Props) {
  const [config, setConfig] = useState<NavbarConfig>(() => {
    if (!value) return DEFAULT_NAVBAR_CONFIG;
    try {
      const parsed = JSON.parse(value);
      return { ...DEFAULT_NAVBAR_CONFIG, ...parsed };
    } catch {
      return DEFAULT_NAVBAR_CONFIG;
    }
  });

  const [activeItemEdit, setActiveItemEdit] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, [value]);

  const updateConfig = (updater: (prev: NavbarConfig) => NavbarConfig) => {
    const updated = updater(config);
    setConfig(updated);
    onChange(JSON.stringify(updated));
  };

  // Menu item actions
  const handleAddItem = () => {
    const newItem: NavItem = {
      id: `item-${Date.now()}`,
      label: 'New Link',
      url: '/',
      target: '_self',
      isActive: true,
    };
    updateConfig((p) => ({ ...p, menuItems: [...p.menuItems, newItem] }));
    setActiveItemEdit(newItem.id);
  };

  const handleUpdateItem = (id: string, partial: Partial<NavItem>) => {
    updateConfig((p) => ({
      ...p,
      menuItems: p.menuItems.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    }));
  };

  const handleDeleteItem = (id: string) => {
    updateConfig((p) => ({
      ...p,
      menuItems: p.menuItems.filter((item) => item.id !== id),
    }));
    if (activeItemEdit === id) setActiveItemEdit(null);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.menuItems.length) return;

    const items = [...config.menuItems];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);

    updateConfig((p) => ({ ...p, menuItems: items }));
  };

  return (
    <div className="space-y-8">
      {/* 1. Live Preview Section */}
      <div className="glass-panel p-6 rounded-3xl border border-primary-500/20 bg-gradient-to-b from-primary-500/5 to-transparent space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Header Preview</h3>
          </div>
          <span className="text-xs text-text-secondary">Updates in real-time as you edit</span>
        </div>

        {/* Announcement Bar Preview */}
        {config.announcement.enabled && (
          <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center justify-between shadow-md">
            <span>{config.announcement.message}</span>
            {config.announcement.linkText && (
              <span className="underline ml-2 cursor-pointer font-bold">{config.announcement.linkText} →</span>
            )}
          </div>
        )}

        {/* Navbar Preview Bar */}
        <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            {config.logo.imageUrl ? (
              <img src={config.logo.imageUrl} alt={config.logo.alt} className="h-7 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="font-bold text-base text-white">
              {config.logo.text.replace(config.logo.highlightText, '')}
              <span className="text-primary-400">{config.logo.highlightText || config.logo.text}</span>
            </span>
          </div>

          {/* Desktop Nav Preview */}
          <div className="hidden md:flex items-center gap-1">
            {config.menuItems
              .filter((i) => i.isActive)
              .slice(0, 7)
              .map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-white bg-white/[0.02] border border-transparent"
                >
                  {item.label}
                </span>
              ))}
          </div>

          {/* CTA Preview */}
          {config.cta.enabled && (
            <span className="btn-primary rounded-xl px-4 py-1.5 text-xs font-bold shadow-md cursor-pointer">
              {config.cta.text}
            </span>
          )}
        </div>
      </div>

      {/* 2. Logo & Branding Settings */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary-400" /> Logo & Brand Identity
          </h3>
          <p className="text-xs text-text-secondary mt-1">Configure your logo image or stylized brand typography.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Brand Title / Text
            </label>
            <input
              type="text"
              value={config.logo.text}
              onChange={(e) =>
                updateConfig((p) => ({ ...p, logo: { ...p.logo, text: e.target.value } }))
              }
              placeholder="TikSavePro"
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Accent Color Substring (Highlight)
            </label>
            <input
              type="text"
              value={config.logo.highlightText}
              onChange={(e) =>
                updateConfig((p) => ({ ...p, logo: { ...p.logo, highlightText: e.target.value } }))
              }
              placeholder="SavePro"
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-primary-400 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Custom Logo Image URL (Optional)
            </label>
            <input
              type="text"
              value={config.logo.imageUrl}
              onChange={(e) =>
                updateConfig((p) => ({ ...p, logo: { ...p.logo, imageUrl: e.target.value } }))
              }
              placeholder="https://example.com/logo.png"
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Logo Target Link
            </label>
            <input
              type="text"
              value={config.logo.link}
              onChange={(e) =>
                updateConfig((p) => ({ ...p, logo: { ...p.logo, link: e.target.value } }))
              }
              placeholder="/"
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Navigation Menu Items Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Menu className="w-5 h-5 text-primary-400" /> Navigation Menu Links
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Add, reorder, link to CMS pages, and manage public header menu items.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="btn-primary rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>

        <div className="space-y-3">
          {config.menuItems.map((item, index) => {
            const isEditing = activeItemEdit === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isEditing
                    ? 'bg-slate-900/90 border-primary-500/40 shadow-xl'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                {/* Item Row Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-bold text-text-secondary w-5">#{index + 1}</span>
                    <span className="font-bold text-sm text-white truncate">{item.label}</span>
                    <code className="text-xs font-mono text-primary-400/80 bg-primary-500/10 px-2 py-0.5 rounded">
                      {item.url}
                    </code>
                    {!item.isActive && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white/10 text-text-secondary">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Move Up/Down */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, 'up')}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === config.menuItems.length - 1}
                      onClick={() => handleMoveItem(index, 'down')}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, { isActive: !item.isActive })}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-text-secondary hover:bg-white/5'
                      }`}
                      title={item.isActive ? 'Active (Visible)' : 'Inactive (Hidden)'}
                    >
                      {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Toggle */}
                    <button
                      type="button"
                      onClick={() => setActiveItemEdit(isEditing ? null : item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isEditing ? 'bg-primary-500 text-white' : 'bg-white/5 text-text-secondary hover:text-white'
                      }`}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                        Link Label *
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                        className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                        Destination URL *
                      </label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUpdateItem(item.id, { url: e.target.value })}
                        className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                        Quick Select CMS Page
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const selected = CMS_PAGE_PRESETS.find((p) => p.url === e.target.value);
                            handleUpdateItem(item.id, {
                              url: e.target.value,
                              label: selected ? selected.label : item.label,
                            });
                          }
                        }}
                        className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-slate-900 text-text-secondary">
                          -- Choose CMS Page --
                        </option>
                        {CMS_PAGE_PRESETS.map((preset) => (
                          <option key={preset.url} value={preset.url} className="bg-slate-900 text-white">
                            {preset.label} ({preset.url})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CTA Button & Announcement Bar Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CTA Button */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-primary-400" /> Header CTA Button
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.cta.enabled}
                onChange={(e) =>
                  updateConfig((p) => ({ ...p, cta: { ...p.cta, enabled: e.target.checked } }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Button Text</label>
              <input
                type="text"
                value={config.cta.text}
                onChange={(e) =>
                  updateConfig((p) => ({ ...p, cta: { ...p.cta, text: e.target.value } }))
                }
                placeholder="Download Video"
                className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Button Link URL</label>
              <input
                type="text"
                value={config.cta.url}
                onChange={(e) =>
                  updateConfig((p) => ({ ...p, cta: { ...p.cta, url: e.target.value } }))
                }
                placeholder="/video"
                className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-accent-400" /> Announcement Bar
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.announcement.enabled}
                onChange={(e) =>
                  updateConfig((p) => ({
                    ...p,
                    announcement: { ...p.announcement, enabled: e.target.checked },
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Banner Message</label>
              <input
                type="text"
                value={config.announcement.message}
                onChange={(e) =>
                  updateConfig((p) => ({
                    ...p,
                    announcement: { ...p.announcement, message: e.target.value },
                  }))
                }
                placeholder="🔥 New: Download TikTok Videos & MP3 in Full HD!"
                className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Link Text</label>
                <input
                  type="text"
                  value={config.announcement.linkText}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      announcement: { ...p.announcement, linkText: e.target.value },
                    }))
                  }
                  placeholder="Try Now"
                  className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Link URL</label>
                <input
                  type="text"
                  value={config.announcement.linkUrl}
                  onChange={(e) =>
                    updateConfig((p) => ({
                      ...p,
                      announcement: { ...p.announcement, linkUrl: e.target.value },
                    }))
                  }
                  placeholder="/bulk"
                  className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
