'use client';

import { useEffect, useState } from 'react';
import { Settings2, Palette, Save, RefreshCw, Globe, HelpCircle, Code, Megaphone, FileText, Database, Download, Upload } from 'lucide-react';
import { getSettings, updateSetting, exportDatabase, importDatabase } from '@/lib/api';
import SeoChecker from '@/components/SeoChecker';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    getSettings()
      .then(list => {
        const map: Record<string, string> = {};
        list.forEach((s: any) => { map[s.key] = s.value; });
        setSettings(map);
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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to save: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
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

              {/* ADS MANAGER TAB */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-primary-400" /> Advertisement Code Manager
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">Paste Google AdSense, banners, or HTML codes directly into the available ad placement slots. These will render live on public pages.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Top Header Ad Code (Slot: Top of all main tools pages)</label>
                      <textarea rows={4} className="w-full glass-input rounded-xl py-3 px-4 text-xs font-mono resize-none" value={settings['ad_top_code'] || ''} onChange={e => set('ad_top_code', e.target.value)} />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Download Result Ad Code (Slot: Displays under download link card output)</label>
                      <textarea rows={4} className="w-full glass-input rounded-xl py-3 px-4 text-xs font-mono resize-none" value={settings['ad_result_code'] || ''} onChange={e => set('ad_result_code', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Bottom Footer Ad Code (Slot: Bottom wrapper above footer)</label>
                      <textarea rows={4} className="w-full glass-input rounded-xl py-3 px-4 text-xs font-mono resize-none" value={settings['ad_bottom_code'] || ''} onChange={e => set('ad_bottom_code', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-2">Sidebar / Compact Ad Code (Slot: Left/Right panels if needed)</label>
                      <textarea rows={4} className="w-full glass-input rounded-xl py-3 px-4 text-xs font-mono resize-none" value={settings['ad_sidebar_code'] || ''} onChange={e => set('ad_sidebar_code', e.target.value)} />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
