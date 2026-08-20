'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit2,
  Check,
  Link as LinkIcon,
  Sparkles,
  Mail,
  ExternalLink,
  Shield,
  FileText,
  HelpCircle,
  Globe
} from 'lucide-react';

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export interface FooterConfig {
  enabled: boolean;
  logo: {
    imageUrl: string;
    text: string;
    highlightText: string;
    alt: string;
    link: string;
  };
  description: string;
  columns: FooterColumn[];
  socials: SocialLink[];
  copyright: string;
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  enabled: true,
  logo: {
    imageUrl: '',
    text: 'TikSavePro',
    highlightText: 'SavePro',
    alt: 'TikSavePro Logo',
    link: '/',
  },
  description:
    'TikSavePro provides simple, fast browser-based tools for downloading and working with publicly available TikTok content.',
  columns: [
    {
      id: 'col-tools',
      title: 'Download Tools',
      links: [
        { id: 'fl-1', label: 'TikTok Downloader', url: '/', target: '_self' },
        { id: 'fl-2', label: 'Video Downloader', url: '/video', target: '_self' },
        { id: 'fl-3', label: 'Audio Extractor', url: '/audio', target: '_self' },
        { id: 'fl-4', label: 'Bulk Downloader', url: '/bulk', target: '_self' },
        { id: 'fl-5', label: 'Android APK', url: '/apk', target: '_self' },
      ],
    },
    {
      id: 'col-company',
      title: 'Company',
      links: [
        { id: 'fl-6', label: 'About Us', url: '/about-us', target: '_self' },
        { id: 'fl-7', label: 'Blog', url: '/blog', target: '_self' },
        { id: 'fl-8', label: 'Contact Us', url: '/contact-us', target: '_self' },
      ],
    },
    {
      id: 'col-legal',
      title: 'Legal',
      links: [
        { id: 'fl-9', label: 'Privacy Policy', url: '/privacy-policy', target: '_self' },
        { id: 'fl-10', label: 'Terms of Service', url: '/terms-of-service', target: '_self' },
        { id: 'fl-11', label: 'DMCA & Disclaimer', url: '/dmca-disclaimer', target: '_self' },
      ],
    },
  ],
  socials: [
    { id: 's-mail', platform: 'Email', url: 'mailto:contact@tik-tokdownloader.xyz', isActive: true },
    { id: 's-x', platform: 'X / Twitter', url: 'https://x.com', isActive: true },
    { id: 's-yt', platform: 'YouTube', url: '', isActive: false },
    { id: 's-fb', platform: 'Facebook', url: '', isActive: false },
    { id: 's-ig', platform: 'Instagram', url: '', isActive: false },
    { id: 's-tt', platform: 'TikTok', url: '', isActive: false },
  ],
  copyright: '© {year} TikSavePro. For educational purposes only. Not affiliated with TikTok.',
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
  { label: 'Terms of Service', url: '/terms-of-service' },
  { label: 'DMCA & Disclaimer', url: '/dmca-disclaimer' },
];

interface Props {
  value: string;
  onChange: (newJson: string) => void;
}

export default function FooterManager({ value, onChange }: Props) {
  const [config, setConfig] = useState<FooterConfig>(() => {
    if (!value) return DEFAULT_FOOTER_CONFIG;
    try {
      const parsed = JSON.parse(value);
      return { ...DEFAULT_FOOTER_CONFIG, ...parsed };
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  });

  const [activeColumnEdit, setActiveColumnEdit] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, [value]);

  const updateConfig = (updater: (prev: FooterConfig) => FooterConfig) => {
    const updated = updater(config);
    setConfig(updated);
    onChange(JSON.stringify(updated));
  };

  // Column management
  const handleAddColumn = () => {
    const newCol: FooterColumn = {
      id: `col-${Date.now()}`,
      title: 'New Section',
      links: [{ id: `l-${Date.now()}`, label: 'Home', url: '/', target: '_self' }],
    };
    updateConfig((p) => ({ ...p, columns: [...p.columns, newCol] }));
    setActiveColumnEdit(newCol.id);
  };

  const handleDeleteColumn = (colId: string) => {
    updateConfig((p) => ({ ...p, columns: p.columns.filter((c) => c.id !== colId) }));
    if (activeColumnEdit === colId) setActiveColumnEdit(null);
  };

  // Link management inside a column
  const handleAddLink = (colId: string) => {
    const newLink: FooterLink = {
      id: `fl-${Date.now()}`,
      label: 'New Link',
      url: '/',
      target: '_self',
    };
    updateConfig((p) => ({
      ...p,
      columns: p.columns.map((col) => (col.id === colId ? { ...col, links: [...col.links, newLink] } : col)),
    }));
  };

  const handleUpdateLink = (colId: string, linkId: string, partial: Partial<FooterLink>) => {
    updateConfig((p) => ({
      ...p,
      columns: p.columns.map((col) =>
        col.id === colId
          ? {
              ...col,
              links: col.links.map((l) => (l.id === linkId ? { ...l, ...partial } : l)),
            }
          : col
      ),
    }));
  };

  const handleDeleteLink = (colId: string, linkId: string) => {
    updateConfig((p) => ({
      ...p,
      columns: p.columns.map((col) =>
        col.id === colId ? { ...col, links: col.links.filter((l) => l.id !== linkId) } : col
      ),
    }));
  };

  const currentYear = new Date().getFullYear();
  const renderedCopyright = (config.copyright || '').replace('{year}', String(currentYear));

  return (
    <div className="space-y-8">
      {/* 1. Live Footer Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-primary-500/20 bg-gradient-to-b from-primary-500/5 to-transparent space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Footer Preview</h3>
          </div>
          <span className="text-xs text-text-secondary">Updates in real-time as you edit</span>
        </div>

        {/* Footer Preview Frame */}
        <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">
                  {config.logo.text.replace(config.logo.highlightText, '')}
                  <span className="text-primary-400">{config.logo.highlightText || config.logo.text}</span>
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                {config.description}
              </p>
            </div>

            {/* Custom columns */}
            {config.columns.map((col) => (
              <div key={col.id} className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">{col.title}</h4>
                <ul className="space-y-1.5 text-xs text-text-secondary">
                  {col.links.map((l) => (
                    <li key={l.id} className="hover:text-white cursor-pointer">
                      {l.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
            <span>{renderedCopyright}</span>
            <div className="flex items-center gap-3">
              {config.socials
                .filter((s) => s.isActive && s.url)
                .map((s) => (
                  <span key={s.id} className="hover:text-white cursor-pointer font-medium text-[11px]">
                    {s.platform}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brand & Description */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-400" /> Footer Brand & Description
          </h3>
          <p className="text-xs text-text-secondary mt-1">Configure company summary and brand text.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Footer Description
            </label>
            <textarea
              rows={3}
              value={config.description}
              onChange={(e) => updateConfig((p) => ({ ...p, description: e.target.value }))}
              placeholder="Simple browser-based tools for downloading TikTok videos..."
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Copyright Notice (Use <code className="text-primary-400">{`{year}`}</code> for auto-year)
            </label>
            <input
              type="text"
              value={config.copyright}
              onChange={(e) => updateConfig((p) => ({ ...p, copyright: e.target.value }))}
              placeholder="© {year} TikSavePro. All rights reserved."
              className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Footer Columns Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary-400" /> Footer Columns & Link Groups
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Add multiple footer link sections and choose destinations from CMS pages.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddColumn}
            className="btn-primary rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Column
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.columns.map((col, cIndex) => {
            return (
              <div
                key={col.id}
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Column Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) =>
                        updateConfig((p) => ({
                          ...p,
                          columns: p.columns.map((c) => (c.id === col.id ? { ...c, title: e.target.value } : c)),
                        }))
                      }
                      className="font-bold text-sm text-white bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-1 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteColumn(col.id)}
                      className="p-1 rounded text-text-secondary hover:text-red-400"
                      title="Delete Column"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Links List */}
                  <div className="space-y-2.5">
                    {col.links.map((link) => (
                      <div
                        key={link.id}
                        className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(col.id, link.id, { label: e.target.value })}
                            placeholder="Link Label"
                            className="w-1/2 glass-input rounded-lg py-1.5 px-2.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(col.id, link.id, { url: e.target.value })}
                            placeholder="URL (/about-us)"
                            className="w-1/2 glass-input rounded-lg py-1.5 px-2.5 text-xs text-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(col.id, link.id)}
                            className="text-text-secondary hover:text-red-400 p-1"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* CMS Preset dropdown */}
                        <div>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                const selected = CMS_PAGE_PRESETS.find((p) => p.url === e.target.value);
                                handleUpdateLink(col.id, link.id, {
                                  url: e.target.value,
                                  label: selected ? selected.label : link.label,
                                });
                              }
                            }}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-[11px] text-text-secondary"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              -- Quick Select CMS Page --
                            </option>
                            {CMS_PAGE_PRESETS.map((p) => (
                              <option key={p.url} value={p.url} className="text-white">
                                {p.label} ({p.url})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddLink(col.id)}
                  className="w-full py-2 rounded-xl border border-dashed border-white/20 text-text-secondary hover:text-white hover:border-primary-500/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Social Links Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-400" /> Social Profiles & Contact Links
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Enable or enter URLs for public social networks and support channels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.socials.map((social) => (
            <div
              key={social.id}
              className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                social.isActive ? 'bg-white/[0.03] border-white/15' : 'bg-black/20 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{social.platform}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={social.isActive}
                    onChange={(e) =>
                      updateConfig((p) => ({
                        ...p,
                        socials: p.socials.map((s) =>
                          s.id === social.id ? { ...s, isActive: e.target.checked } : s
                        ),
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <input
                type="text"
                value={social.url}
                disabled={!social.isActive}
                onChange={(e) =>
                  updateConfig((p) => ({
                    ...p,
                    socials: p.socials.map((s) => (s.id === social.id ? { ...s, url: e.target.value } : s)),
                  }))
                }
                placeholder={social.id === 's-mail' ? 'mailto:support@domain.com' : 'https://...'}
                className="w-full glass-input rounded-xl py-1.5 px-2.5 text-xs text-white disabled:opacity-40 font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
