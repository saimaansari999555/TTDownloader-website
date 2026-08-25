'use client';

import { useEffect, useState } from 'react';
import { Settings2, Palette, Save, RefreshCw, Globe, HelpCircle, Code, Megaphone, FileText, Database, Download, Upload, ArrowLeftRight, Menu, Layout } from 'lucide-react';
import { getSettings, updateSetting, exportDatabase, importDatabase } from '@/lib/api';
import SeoChecker from '@/components/SeoChecker';
import RedirectManager from '@/components/admin/RedirectManager';
import NavbarManager from '@/components/admin/NavbarManager';
import FooterManager from '@/components/admin/FooterManager';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    let localMap: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tiksave_settings_cache');
        if (cached) {
          localMap = JSON.parse(cached);
          setSettings(localMap);
        }
      } catch {}
    }

    getSettings()
      .then(list => {
        const serverMap: Record<string, string> = {};
        if (Array.isArray(list)) {
          list.forEach((s: any) => { serverMap[s.key] = s.value; });
        }
        setSettings(prev => ({ ...serverMap, ...localMap, ...prev }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => updateSetting(key, value))
      );
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tiksave_settings_cache', JSON.stringify(settings));
          window.dispatchEvent(new CustomEvent('tiksave_settings_updated', { detail: settings }));
        } catch {}
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to save: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const backup = await exportDatabase();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tiksave_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Export failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmRestore = confirm(
      "Are you absolutely sure you want to restore this database snapshot?\n\nThis will completely overwrite and replace all current custom pages, settings, blog posts, and contact inbox submissions."
    );
    if (!confirmRestore) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const payload = JSON.parse(evt.target?.result as string);
        await importDatabase(payload);
        alert('Database snapshot fully restored! Page will now refresh.');
        window.location.reload();
      } catch (err: any) {
        alert('Restore failed: ' + (err.response?.data?.message || err.message || 'Invalid JSON format'));
      } finally {
        setRestoring(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', label: 'Page Content', icon: FileText },
    { id: 'seo', label: 'SEO Optimization', icon: Globe },
    { id: 'redirects', label: 'Redirect Manager', icon: ArrowLeftRight },
    { id: 'navbar', label: 'Navbar & Header', icon: Menu },
    { id: 'footer', label: 'Footer Customizer', icon: Layout },
    { id: 'ads', label: 'Ads Manager', icon: Megaphone },
    { id: 'theme', label: 'Theme Customizer', icon: Palette },
    { id: 'backup', label: 'Backup & Recovery', icon: Database },
    { id: 'advanced', label: 'Advanced', icon: Settings2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">System Configuration</h1>
          <p className="text-text-secondary">Configure your TikTok CMS page contents, SEO settings, and advertisements.</p>
        </div>
        <button onClick={saveAll} disabled={saving} className="btn-primary rounded-xl px-6 py-3.5 flex items-center gap-2 font-bold disabled:opacity-70 shadow-lg active:scale-95 transition-all">
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saved ? 'Settings Saved Successfully!' : 'Save All Configuration'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${activeTab === tab.id ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20 font-bold' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="flex-1 w-full glass-panel rounded-2xl p-6 md:p-8 shadow-xl">
          {loading ? (
            <div className="text-text-secondary text-center py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-400" />
              <span>Fetching configuration from server...</span>
            </div>
          ) : (
            <>
              {/* PAGE CONTENT TAB */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary-400" /> Customize Page Content
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">Update headings, subheadings, and texts for all public facing pages of your website.</p>
                  
                  <div className="space-y-6">
                    {/* Home Page Content */}
                    <div className="p-5 bg-white/5 rounded-xl border border-white/5 space-y-4">
                      <h3 className="text-lg font-bold text-white">Main Downloader Page</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Main Heading</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_home_title'] || ''} onChange={e => set('page_home_title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Subheading/Description</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_home_desc'] || ''} onChange={e => set('page_home_desc', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Downloader Page Headers */}
                    <div className="p-5 bg-white/5 rounded-xl border border-white/5 space-y-4">
                      <h3 className="text-lg font-bold text-white">Specific Download Tool Headers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Video Page Title</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_video_title'] || ''} onChange={e => set('page_video_title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Video Page Subdescription</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_video_desc'] || ''} onChange={e => set('page_video_desc', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Audio Page Title</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_audio_title'] || ''} onChange={e => set('page_audio_title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Audio Page Subdescription</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_audio_desc'] || ''} onChange={e => set('page_audio_desc', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Bulk Page Title</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_bulk_title'] || ''} onChange={e => set('page_bulk_title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Bulk Page Subdescription</label>
                          <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_bulk_desc'] || ''} onChange={e => set('page_bulk_desc', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* About and Contact Content */}
                    <div className="p-5 bg-white/5 rounded-xl border border-white/5 space-y-4">
                      <h3 className="text-lg font-bold text-white">General & Support Pages</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">About Page Content Block</label>
                          <textarea rows={3} className="w-full glass-input rounded-xl py-2.5 px-4 text-sm resize-none" value={settings['page_about_content'] || ''} onChange={e => set('page_about_content', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">APK Page Title</label>
                            <input type="text" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_apk_title'] || ''} onChange={e => set('page_apk_title', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">Contact Page Reply-To Email</label>
                            <input type="email" className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" value={settings['page_contact_email'] || ''} onChange={e => set('page_contact_email', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO OPTIMIZATION TAB */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-primary-400" /> Search Engine Optimization (SEO)
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">Optimize meta attributes, crawl permissions, analytics triggers, and site identification markers to improve search rankings.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Site Name Meta Title</label>
                      <input type="text" className="w-full glass-input rounded-xl py-3 px-4 text-sm" value={settings['site_name'] || ''} onChange={e => set('site_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Site Tagline</label>
                      <input type="text" className="w-full glass-input rounded-xl py-3 px-4 text-sm" value={settings['site_tagline'] || ''} onChange={e => set('site_tagline', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-secondary mb-2">SEO Description (Meta Description)</label>
                      <textarea rows={3} className="w-full glass-input rounded-xl py-3 px-4 text-sm resize-none" value={settings['meta_description'] || ''} onChange={e => set('meta_description', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-secondary mb-2">Meta Keywords (Comma separated)</label>
                      <input type="text" className="w-full glass-input rounded-xl py-3 px-4 text-sm" value={settings['meta_keywords'] || ''} onChange={e => set('meta_keywords', e.target.value)} />
                    </div>

                    <div className="md:col-span-2">
                      <SeoChecker 
                        title={settings['site_name'] || ''}
                        description={settings['meta_description'] || ''}
                        keywords={settings['meta_keywords'] || ''}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Google Analytics GA4 Tag</label>
                      <input type="text" className="w-full glass-input rounded-xl py-3 px-4 text-sm" placeholder="G-XXXXXXXXXX" value={settings['google_analytics'] || ''} onChange={e => set('google_analytics', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-secondary mb-2">Robots.txt Content</label>
                      <textarea rows={4} className="w-full glass-input rounded-xl py-3 px-4 text-sm font-mono resize-none" value={settings['robots_txt'] || ''} onChange={e => set('robots_txt', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* REDIRECT MANAGER TAB */}
              {activeTab === 'redirects' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                      <ArrowLeftRight className="w-6 h-6 text-primary-400" /> Redirect Manager
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mt-2">
                      Create and manage permanent (301) and temporary (302) URL redirects to preserve SEO rankings, prevent 404 errors, and map old page/blog paths seamlessly.
                    </p>
                  </div>
                  <RedirectManager />
                </div>
              )}

              {/* NAVBAR & HEADER MANAGER TAB */}
              {activeTab === 'navbar' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                      <Menu className="w-6 h-6 text-primary-400" /> Navbar & Header Manager
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mt-2">
                      Customize your website logo, navigation menu links, CTA button, announcement bar, and mobile header without editing source code.
                    </p>
                  </div>
                  <NavbarManager
                    value={settings['navbar_config'] || ''}
                    onChange={(val) => set('navbar_config', val)}
                  />
                </div>
              )}

              {/* FOOTER CUSTOMIZER TAB */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                      <Layout className="w-6 h-6 text-primary-400" /> Footer Customizer
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mt-2">
                      Customize your multi-column footer layout, company description, social profiles, copyright notice, and legal links.
                    </p>
                  </div>
                  <FooterManager
                    value={settings['footer_config'] || ''}
                    onChange={(val) => set('footer_config', val)}
                  />
                </div>
              )}

              {/* ADS MANAGER TAB */}
              {activeTab === 'ads' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                      <Megaphone className="w-6 h-6 text-primary-400" /> Advertisement Manager
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mt-2">Configure Google AdSense integration, verification flags, and custom manual advertisement slot codes.</p>
                  </div>

                  {/* Validation warning */}
                  {(() => {
                    const isAdSenseEn = settings['adsense_enabled'] === 'true';
                    const pubId = settings['adsense_publisher_id'] || '';
                    if (isAdSenseEn) {
                      if (!pubId.trim()) {
                        return (
                          <div className="flex items-center gap-2 text-accent-500 bg-accent-500/10 px-4 py-3 rounded-xl border border-accent-500/20 font-semibold text-sm">
                            <HelpCircle className="w-4 h-4 shrink-0 animate-pulse" />
                            Google AdSense is enabled, but Publisher ID is missing.
                          </div>
                        );
                      }
                      if (!pubId.startsWith('ca-pub-')) {
                        return (
                          <div className="flex items-center gap-2 text-accent-500 bg-accent-500/10 px-4 py-3 rounded-xl border border-accent-500/20 font-semibold text-sm">
                            <HelpCircle className="w-4 h-4 shrink-0" />
                            Invalid Publisher ID format. Example: ca-pub-XXXXXXXXXXXXXXXX
                          </div>
                        );
                      }
                      const missing: string[] = [];
                      if (!settings['adsense_header_slot']?.trim()) missing.push("Header");
                      if (!settings['adsense_download_slot']?.trim()) missing.push("Download Result");
                      if (!settings['adsense_footer_slot']?.trim()) missing.push("Footer");
                      if (!settings['adsense_sidebar_slot']?.trim()) missing.push("Sidebar");
                      if (missing.length > 0) {
                        return (
                          <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-4 py-3 rounded-xl border border-yellow-500/20 font-semibold text-sm">
                            <HelpCircle className="w-4 h-4 shrink-0" />
                            AdSense Slot ID is missing for this placement: {missing.join(', ')}.
                          </div>
                        );
                      }
                    }
                    return null;
                  })()}

                  {/* Grid layout */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Google AdSense Config */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <div>
                          <h3 className="text-lg font-black text-white">Google AdSense Configuration</h3>
                          <p className="text-xs text-text-secondary mt-0.5">Toggle auto adsense script injection and slots</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => set('adsense_enabled', settings['adsense_enabled'] === 'true' ? 'false' : 'true')}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all border ${
                            settings['adsense_enabled'] === 'true'
                              ? 'bg-green-500/15 text-green-400 border-green-500/30'
                              : 'bg-white/5 text-text-secondary border-white/10 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {settings['adsense_enabled'] === 'true' ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-2">Google AdSense Publisher ID</label>
                          <input 
                            type="text" 
                            placeholder="e.g., ca-pub-1234567890123456"
                            className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" 
                            value={settings['adsense_publisher_id'] || ''} 
                            onChange={e => set('adsense_publisher_id', e.target.value)} 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">Header Slot ID</label>
                            <input 
                              type="text" 
                              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm font-mono" 
                              value={settings['adsense_header_slot'] || ''} 
                              onChange={e => set('adsense_header_slot', e.target.value)} 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">Download Result Slot ID</label>
                            <input 
                              type="text" 
                              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm font-mono" 
                              value={settings['adsense_download_slot'] || ''} 
                              onChange={e => set('adsense_download_slot', e.target.value)} 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">Footer Slot ID</label>
                            <input 
                              type="text" 
                              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm font-mono" 
                              value={settings['adsense_footer_slot'] || ''} 
                              onChange={e => set('adsense_footer_slot', e.target.value)} 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">Sidebar Slot ID</label>
                            <input 
                              type="text" 
                              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm font-mono" 
                              value={settings['adsense_sidebar_slot'] || ''} 
                              onChange={e => set('adsense_sidebar_slot', e.target.value)} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2">Ad Format</label>
                            <select 
                              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm bg-slate-900 border border-white/10 text-white" 
                              value={settings['adsense_ad_format'] || 'auto'} 
                              onChange={e => set('adsense_ad_format', e.target.value)}
                            >
                              <option value="auto">Auto</option>
                              <option value="rectangle">Rectangle</option>
                              <option value="horizontal">Horizontal</option>
                              <option value="vertical">Vertical</option>
                              <option value="responsive">Responsive</option>
                            </select>
                          </div>

                          <div className="flex flex-col justify-between">
                            <label className="block text-xs font-bold text-text-secondary mb-2">Full Width Responsive</label>
                            <button
                              type="button"
                              onClick={() => set('adsense_full_width_responsive', settings['adsense_full_width_responsive'] === 'true' ? 'false' : 'true')}
                              className={`w-full py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all tracking-wide border ${
                                settings['adsense_full_width_responsive'] !== 'false'
                                  ? 'bg-primary-500/15 text-primary-400 border-primary-500/30'
                                  : 'bg-white/5 text-text-secondary border-white/10'
                              }`}
                            >
                              {settings['adsense_full_width_responsive'] !== 'false' ? 'Responsive (ON)' : 'Fixed Layout (OFF)'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Custom Placements (Fallback) */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                      <div>
                        <h3 className="text-lg font-black text-white">Manual HTML Ad Banners</h3>
                        <p className="text-xs text-text-secondary mt-0.5">Used as backup fallbacks or direct code injection ads</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-1.5">Top Header HTML Code</label>
                          <textarea rows={2} className="w-full glass-input rounded-xl py-2 px-3 text-xs font-mono resize-none" value={settings['ad_top_code'] || ''} onChange={e => set('ad_top_code', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-1.5">Download Result HTML Code</label>
                          <textarea rows={2} className="w-full glass-input rounded-xl py-2 px-3 text-xs font-mono resize-none" value={settings['ad_result_code'] || ''} onChange={e => set('ad_result_code', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-1.5">Bottom Footer HTML Code</label>
                          <textarea rows={2} className="w-full glass-input rounded-xl py-2 px-3 text-xs font-mono resize-none" value={settings['ad_bottom_code'] || ''} onChange={e => set('ad_bottom_code', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-1.5">Sidebar HTML Code</label>
                          <textarea rows={2} className="w-full glass-input rounded-xl py-2 px-3 text-xs font-mono resize-none" value={settings['ad_sidebar_code'] || ''} onChange={e => set('ad_sidebar_code', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Site Verification Meta Code */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 xl:col-span-2">
                      <div>
                        <h3 className="text-lg font-black text-white">AdSense Site Verification</h3>
                        <p className="text-xs text-text-secondary mt-0.5">Paste Google Adsense site verification meta code or verification tags here. This is loaded globally in the page header structure.</p>
                      </div>
                      
                      <textarea 
                        rows={3} 
                        placeholder={`<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />`}
                        className="w-full glass-input rounded-xl py-2 px-3 text-xs font-mono resize-none" 
                        value={settings['adsense_verification_code'] || ''} 
                        onChange={e => set('adsense_verification_code', e.target.value)} 
                      />
                    </div>

                    {/* ads.txt file manager */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 xl:col-span-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-black text-white">ads.txt Content</h3>
                        <p className="text-xs text-text-secondary mt-0.5">Define your publisher authentication codes. This is served live at the root address: <code className="text-primary-400">/ads.txt</code></p>
                      </div>
                      
                      <textarea 
                        rows={4} 
                        placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
                        className="w-full glass-input rounded-xl py-2.5 px-4 text-xs font-mono resize-none" 
                        value={settings['ads_txt_content'] || ''} 
                        onChange={e => set('ads_txt_content', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* THEME CUSTOMIZER TAB */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Palette className="w-6 h-6 text-primary-400" /> Color & Styling Editor
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-3">Primary Action Color</label>
                      <div className="flex gap-4">
                        {['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#ec4899'].map(color => (
                          <div 
                            key={color} 
                            onClick={() => set('primary_color', color)}
                            className={`w-12 h-12 rounded-full cursor-pointer border-4 transition-all hover:scale-110 ${settings['primary_color'] === color ? 'border-white shadow-lg' : 'border-transparent opacity-80'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-2">Custom CSS Rules Injection</label>
                      <textarea rows={8} className="w-full glass-input rounded-xl py-3 px-4 text-sm font-mono resize-none" placeholder="/* custom style overrides here */" value={settings['custom_css'] || ''} onChange={e => set('custom_css', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* ADVANCED TAB */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Settings2 className="w-6 h-6 text-primary-400" /> Advanced Options
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'maintenance_mode', label: 'Maintenance Mode Toggle', desc: 'Display a maintenance splash screen to all regular visitors.' },
                      { key: 'allow_registration', label: 'Allow Public Signups', desc: 'Allow visitors to create accounts (keep disabled unless running multi-user blogs).' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <p className="text-white font-bold text-base">{item.label}</p>
                          <p className="text-text-secondary text-sm mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={settings[item.key] === 'true'} onChange={e => set(item.key, e.target.checked ? 'true' : 'false')} />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BACKUP & RECOVERY TAB */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary-400" /> Database Backup & Recovery
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Export your entire website's database data to a JSON snapshot file, or restore/recover it from a previous backup snapshot in case of data loss or server migration.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Export */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                          <Download className="w-5 h-5 text-green-400" /> Export Database Snapshot
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Download a single JSON file backup containing all custom pages, layouts, settings, blog posts, media files, and contact messages.
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={handleExport}
                        className="btn-primary py-3.5 px-6 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 w-full active:scale-95 transition-all"
                      >
                        <Download className="w-4 h-4" /> Download Snapshot
                      </button>
                    </div>

                    {/* Import */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                          <Upload className="w-5 h-5 text-accent-400" /> Restore Database Snapshot
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Upload a previously exported JSON backup file to restore/recover your site structure.
                          <span className="block text-accent-400 mt-1 font-bold">⚠️ Warning: This will overwrite and replace all current pages, layouts, and system configurations.</span>
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <input 
                          type="file" 
                          accept=".json"
                          id="backup-upload"
                          className="hidden" 
                          onChange={handleImport}
                          disabled={restoring}
                        />
                        <label 
                          htmlFor="backup-upload"
                          className={`btn-secondary py-3.5 px-6 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 w-full cursor-pointer hover:bg-white/10 active:scale-95 transition-all ${restoring ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {restoring ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-primary-400" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {restoring ? 'Restoring Snapshot...' : 'Upload Snapshot'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom In-Tab Save Action Bar */}
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="text-xs text-text-secondary">
                  {saved ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      ✓ Changes successfully saved and synchronized with live website!
                    </span>
                  ) : (
                    <span>Make sure to save changes so they reflect immediately on your live website.</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={saving}
                  className="btn-primary rounded-xl px-8 py-3.5 flex items-center gap-2.5 font-bold disabled:opacity-70 shadow-lg active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Settings Saved Live!' : 'Save Configuration Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
