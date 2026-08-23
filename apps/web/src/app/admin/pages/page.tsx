'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Layout,
  Save,
  CheckCircle,
  Smartphone,
  Upload,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Globe,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Download,
  Music,
  Users,
  Mail
} from 'lucide-react';
import { getCustomPages, createCustomPage, updateCustomPage, deleteCustomPage } from '@/lib/api';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface PageForm {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  toolType: string; // 'none' | 'downloader_tool' | 'audio_tool' | 'bulk_tool' | 'apk_tool' | 'contact_tool'
  heroEnabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroBgColor: string;
  heroBgImage: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const emptyForm: PageForm = {
  title: '',
  slug: '',
  content: '',
  isPublished: true,
  toolType: 'none',
  heroEnabled: true,
  heroTitle: '',
  heroSubtitle: '',
  heroBadge: '',
  heroBgColor: '#090d16',
  heroBgImage: '',
  imageUrl: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
};

// Helper: convert blocks JSON to readable HTML content
function blocksToHtml(blocks: any[]): { html: string; hero: any; toolType: string } {
  let hero: any = null;
  let toolType = 'none';
  const htmlParts: string[] = [];

  if (!Array.isArray(blocks)) {
    return { html: '', hero, toolType };
  }

  for (const block of blocks) {
    if (!block) continue;

    if (block.type === 'hero' && !hero) {
      hero = block;
      continue;
    }

    if (block.type === 'downloader_tool') {
      toolType = 'downloader_tool';
      continue;
    }
    if (block.type === 'audio_tool') {
      toolType = 'audio_tool';
      continue;
    }
    if (block.type === 'bulk_tool') {
      toolType = 'bulk_tool';
      continue;
    }
    if (block.type === 'apk_tool') {
      toolType = 'apk_tool';
      continue;
    }
    if (block.type === 'contact_tool') {
      toolType = 'contact_tool';
      continue;
    }

    if (block.type === 'rich_text' || block.type === 'content' || block.type === 'html') {
      htmlParts.push(block.content || block.text || '');
      continue;
    }

    if (block.type === 'heading') {
      const level = block.level || 'h2';
      htmlParts.push(`<${level}>${block.text || ''}</${level}>`);
    } else if (block.type === 'paragraph') {
      const text = (block.text || '').replace(/\n/g, '<br />');
      htmlParts.push(`<p>${text}</p>`);
    } else if (block.type === 'image') {
      htmlParts.push(`<p><img src="${block.url || ''}" alt="${block.caption || ''}" /></p>`);
    } else if (block.type === 'cta_box') {
      htmlParts.push(
        `<div class="p-6 my-6 bg-slate-900 border border-indigo-500/30 rounded-2xl text-center"><h3>${block.title || ''}</h3><p>${block.subtitle || ''}</p><p><a href="${block.buttonLink || '/'}">${block.buttonText || 'Learn More'}</a></p></div>`
      );
    } else if (block.type === 'cards_grid' && Array.isArray(block.cards)) {
      const cardsHtml = block.cards
        .map(
          (c: any) =>
            `<div class="p-4 bg-slate-900/60 border border-white/10 rounded-xl my-2"><h4>${c.title || ''}</h4><p>${c.desc || ''}</p></div>`
        )
        .join('');
      htmlParts.push(`<div>${cardsHtml}</div>`);
    } else if (block.type === 'faq' && Array.isArray(block.faqs)) {
      const faqHtml = block.faqs
        .map(
          (f: any) =>
            `<h3>${f.q || ''}</h3><p>${f.a || ''}</p>`
        )
        .join('');
      htmlParts.push(`<div>${faqHtml}</div>`);
    }
  }

  return { html: htmlParts.join('\n\n'), hero, toolType };
}

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState<PageForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Media Library Picker Modal
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showHeroConfig, setShowHeroConfig] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('uploaded_media_assets') : null;
    if (saved) {
      try {
        setMediaAssets(JSON.parse(saved));
      } catch {}
    }
  }, [showMediaPicker, showEditor]);

  const safeSaveLocalStorage = (key: string, data: any[]) => {
    if (typeof window === 'undefined' || !Array.isArray(data)) return;
    try {
      localStorage.setItem(key, JSON.stringify(data.slice(0, 30)));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
  };

  const saveToMediaLibrary = (fileOrUrlName: string, url: string) => {
    if (typeof window === 'undefined' || !url) return;
    try {
      const saved = localStorage.getItem('uploaded_media_assets');
      const list = saved ? JSON.parse(saved) : [];
      const exists = list.some((item: any) => item.url === url);
      if (!exists) {
        const newAsset = {
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: fileOrUrlName || 'page-image.png',
          url: url,
          type: 'image/jpeg',
          size: 'Uploaded Asset',
          date: new Date().toISOString().split('T')[0],
        };
        safeSaveLocalStorage('uploaded_media_assets', [newAsset, ...list]);
        setMediaAssets([newAsset, ...list]);
      }
    } catch {}
  };

  const load = () => {
    setLoading(true);
    getCustomPages()
      .then((res) => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('local_custom_pages') || '[]') : [];
        const apiPages = Array.isArray(res) ? res : [];
        const combined = [...local, ...apiPages];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => t.slug === v.slug || t.id === v.id) === i);
        setPages(unique);
        safeSaveLocalStorage('local_custom_pages', unique);
      })
      .catch(() => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('local_custom_pages') || '[]') : [];
        setPages(local);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const rawUrl = event.target.result as string;
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.65);
            setForm((p) => ({ ...p, imageUrl: compressedUrl }));
            saveToMediaLibrary(file.name, compressedUrl);
          };
          img.onerror = () => {
            setForm((p) => ({ ...p, imageUrl: rawUrl }));
            saveToMediaLibrary(file.name, rawUrl);
          };
          img.src = rawUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const copyImageUrl = (url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleEdit = (page: any) => {
    let parsedContent = page.content || '';
    let heroConfig = {
      heroEnabled: true,
      heroTitle: page.title || '',
      heroSubtitle: '',
      heroBadge: '',
      heroBgColor: '#090d16',
      heroBgImage: '',
    };
    let toolType = 'none';

    if (page.layout) {
      try {
        const blocks = typeof page.layout === 'string' ? JSON.parse(page.layout) : page.layout;
        const res = blocksToHtml(blocks);
        if (!parsedContent && res.html) {
          parsedContent = res.html;
        }
        if (res.hero) {
          heroConfig = {
            heroEnabled: true,
            heroTitle: res.hero.title || page.title,
            heroSubtitle: res.hero.subtitle || '',
            heroBadge: res.hero.badge || '',
            heroBgColor: res.hero.bgColor || '#090d16',
            heroBgImage: res.hero.bgImage || '',
          };
        }
        if (res.toolType !== 'none') {
          toolType = res.toolType;
        }
      } catch {}
    }

    setForm({
      title: page.title || '',
      slug: page.slug || '',
      content: parsedContent,
      isPublished: page.isPublished !== undefined ? page.isPublished : true,
      toolType: toolType,
      heroEnabled: heroConfig.heroEnabled,
      heroTitle: heroConfig.heroTitle || page.title,
      heroSubtitle: heroConfig.heroSubtitle,
      heroBadge: heroConfig.heroBadge,
      heroBgColor: heroConfig.heroBgColor,
      heroBgImage: heroConfig.heroBgImage,
      imageUrl: page.featuredImage || page.imageUrl || '',
      seoTitle: page.seoTitle || page.title || '',
      seoDescription: page.seoDescription || '',
      seoKeywords: page.seoKeywords || '',
    });

    setEditId(page.id || page.slug);
    setShowEditor(true);
    setShowHeroConfig(Boolean(heroConfig.heroSubtitle || heroConfig.heroBadge));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const generatedSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${Date.now()}`;

      // Assemble rich blocks layout so both renderers work seamlessly
      const blocks: any[] = [];

      if (form.heroEnabled) {
        blocks.push({
          id: 'hero-' + generatedSlug,
          type: 'hero',
          title: form.heroTitle || form.title,
          subtitle: form.heroSubtitle || '',
          badge: form.heroBadge || '',
          bgColor: form.heroBgColor || '#090d16',
          bgImage: form.heroBgImage || '',
        });
      }

      if (form.toolType && form.toolType !== 'none') {
        blocks.push({
          id: 'tool-' + form.toolType,
          type: form.toolType,
        });
      }

      if (form.content && form.content.trim()) {
        blocks.push({
          id: 'rich-content-' + generatedSlug,
          type: 'rich_text',
          content: form.content,
        });
      }

      const pagePayload = {
        id: editId || generatedSlug,
        title: form.title,
        slug: generatedSlug,
        content: form.content,
        layout: JSON.stringify(blocks),
        isPublished: form.isPublished,
        featuredImage: form.imageUrl || null,
        imageUrl: form.imageUrl || null,
        seoTitle: form.seoTitle || form.title,
        seoDescription: form.seoDescription || '',
        seoKeywords: form.seoKeywords || '',
        updatedAt: new Date().toISOString(),
      };

      // 1. Optimistic LocalStorage update
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('local_custom_pages') || '[]');
        const filtered = local.filter((p: any) => p.slug !== generatedSlug && p.id !== pagePayload.id);
        const updatedLocal = [pagePayload, ...filtered];
        safeSaveLocalStorage('local_custom_pages', updatedLocal);
        window.dispatchEvent(new CustomEvent('tiksave_pages_updated', { detail: pagePayload }));
      }

      // 2. Remote API persistence
      if (editId) {
        await updateCustomPage(editId, pagePayload);
      } else {
        await createCustomPage(pagePayload);
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setShowEditor(false);
        setEditId(null);
        setForm(emptyForm);
      }, 1200);

      load();
    } catch (err: any) {
      alert('Failed to save page: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete the page "${slug}"?`)) return;

    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('local_custom_pages') || '[]');
      const filtered = local.filter((p: any) => p.id !== id && p.slug !== slug);
      safeSaveLocalStorage('local_custom_pages', filtered);
      window.dispatchEvent(new CustomEvent('tiksave_pages_updated'));
    }

    try {
      await deleteCustomPage(id || slug);
    } catch {}

    load();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Page Builder</h1>
          <p className="text-text-secondary">
            {pages.length} CMS and utility pages available. Edit rich content, hero banners, and SEO meta tags.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={load}
            className="p-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            title="Refresh Page List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {!showEditor && (
            <button
              onClick={() => {
                setForm(emptyForm);
                setEditId(null);
                setShowEditor(true);
              }}
              className="btn-primary rounded-xl px-5 py-3 flex items-center gap-2 font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" /> Build New Page
            </button>
          )}
        </div>
      </div>

      {/* 1. Page Editor View */}
      {showEditor ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditor(false);
                  setEditId(null);
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
              >
                ← Back to Pages
              </button>
              <span className="text-white/20">|</span>
              <span className="text-sm font-bold text-white">
                {editId ? `Editing: ${form.title || form.slug}` : 'Creating New Page'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved & Live!
                </span>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editId ? 'Save & Update Page' : 'Publish New Page'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Columns: Main Content & Visual Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Slug Box */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Privacy Policy, Terms of Service, or Android APK"
                    value={form.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((p) => ({
                        ...p,
                        title: val,
                        slug: editId ? p.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                        heroTitle: p.heroTitle || val,
                      }));
                    }}
                    className="w-full glass-input rounded-xl py-3 px-4 text-base font-bold text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      URL Slug *
                    </label>
                    <div className="flex items-center rounded-xl overflow-hidden border border-white/10 bg-slate-950/60 focus-within:border-primary-500">
                      <span className="px-3 text-xs text-text-secondary font-mono border-r border-white/10">/</span>
                      <input
                        type="text"
                        required
                        value={form.slug}
                        onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        placeholder="my-custom-page"
                        className="w-full py-2.5 px-3 bg-transparent text-xs font-mono text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Interactive Tool Embed
                    </label>
                    <select
                      value={form.toolType}
                      onChange={(e) => setForm((p) => ({ ...p, toolType: e.target.value }))}
                      className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white bg-slate-900"
                    >
                      <option value="none">No Tool (Pure Article / Legal Page)</option>
                      <option value="downloader_tool">⚡ TikTok Video Downloader</option>
                      <option value="audio_tool">🎵 TikTok Audio Extractor</option>
                      <option value="bulk_tool">👥 Profile Bulk Downloader</option>
                      <option value="apk_tool">📱 Android APK Coming Soon</option>
                      <option value="contact_tool">✉️ Contact Form</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hero Banner Settings Collapsible */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="heroToggle"
                      checked={form.heroEnabled}
                      onChange={(e) => setForm((p) => ({ ...p, heroEnabled: e.target.checked }))}
                      className="rounded border-white/20 bg-white/5 text-primary-500 w-4 h-4 focus:ring-0"
                    />
                    <label htmlFor="heroToggle" className="text-sm font-bold text-white cursor-pointer flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary-400" /> Enable Hero Top Banner
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeroConfig((p) => !p)}
                    className="text-xs text-text-secondary hover:text-white flex items-center gap-1 font-semibold"
                  >
                    {showHeroConfig ? 'Hide Details' : 'Configure Banner'}
                    {showHeroConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {form.heroEnabled && showHeroConfig && (
                  <div className="space-y-4 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Hero Main Heading</label>
                        <input
                          type="text"
                          placeholder={form.title || 'Hero Banner Title'}
                          value={form.heroTitle}
                          onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
                          className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Badge Chip Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Official Policy or Coming Soon"
                          value={form.heroBadge}
                          onChange={(e) => setForm((p) => ({ ...p, heroBadge: e.target.value }))}
                          className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">Hero Subtitle</label>
                      <input
                        type="text"
                        placeholder="A concise introductory description for this page"
                        value={form.heroSubtitle}
                        onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                        className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Body Content (WYSIWYG Editor) */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-400" /> Page Body & Article Content
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Write formatted text, paste articles from ChatGPT, format H1/H2/H3 headings, lists, links, quotes, and FAQs.
                    </p>
                  </div>
                </div>

                <RichTextEditor
                  value={form.content}
                  onChange={(val) => setForm((p) => ({ ...p, content: val }))}
                  placeholder="Type or paste your page content here..."
                />
              </div>
            </div>

            {/* Right 1 Column: Sidebar & SEO */}
            <div className="space-y-6">
              {/* Publishing Status Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                  Publishing Settings
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Status</span>
                    <span className="text-[11px] text-text-secondary">
                      {form.isPublished ? 'Publicly visible' : 'Hidden draft'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                {form.slug && (
                  <div className="pt-2 border-t border-white/10">
                    <a
                      href={`/p/${form.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-400 hover:underline font-bold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview Public Route
                    </a>
                  </div>
                )}
              </div>

              {/* Featured Image Upload */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                  <span>Banner / Featured Image</span>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1 normal-case"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Library
                  </button>
                </h3>

                {form.imageUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 h-40">
                      <img src={form.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, imageUrl: '' }))}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/15 hover:border-primary-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                    <Upload className="w-6 h-6 text-text-secondary" />
                    <span className="text-xs font-bold text-white">Upload Banner Image</span>
                    <span className="text-[10px] text-text-secondary">JPEG, PNG, WebP (auto-optimized)</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* SEO Suite */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary-400" /> Search Engine Optimization
                </h3>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-text-secondary">SEO Meta Title</label>
                    <span className={`text-[10px] ${(form.seoTitle || form.title).length > 60 ? 'text-amber-400' : 'text-text-secondary'}`}>
                      {(form.seoTitle || form.title).length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder={form.title || 'Page SEO Title'}
                    value={form.seoTitle}
                    onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
                    className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-text-secondary">Meta Description</label>
                    <span className={`text-[10px] ${form.seoDescription.length > 160 ? 'text-amber-400' : 'text-text-secondary'}`}>
                      {form.seoDescription.length}/160
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter meta description for search engine result snippets..."
                    value={form.seoDescription}
                    onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                    className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Keywords</label>
                  <input
                    type="text"
                    placeholder="tiktok downloader, policy, mp3, mp4"
                    value={form.seoKeywords}
                    onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
                    className="w-full glass-input rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>

                {/* Google SERP Preview */}
                <div className="pt-3 border-t border-white/10">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                    Google Search Result Preview
                  </span>
                  <div className="p-3.5 bg-slate-950 border border-white/5 rounded-xl space-y-1">
                    <div className="text-[11px] text-slate-400 truncate">
                      https://tik-tokdownloader.xyz/p/{form.slug || 'page-slug'}
                    </div>
                    <div className="text-xs font-bold text-indigo-400 truncate hover:underline cursor-pointer">
                      {form.seoTitle || form.title || 'Page Title - TikSavePro'}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {form.seoDescription || 'Read and explore this page on TikSavePro TikTok Downloader online web utility.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* 2. Pages Table / Card Grid List View */
        <div className="space-y-4">
          {loading ? (
            <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-400" />
              <span className="text-text-secondary text-sm">Loading custom pages...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
              <Layout className="w-12 h-12 text-text-secondary/40 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Custom Pages Found</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                Build legal pages, guides, download tools, or feature pages easily with the visual editor.
              </p>
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setEditId(null);
                  setShowEditor(true);
                }}
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create First Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {pages.map((page) => (
                <div
                  key={page.id || page.slug}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-primary-500/40 transition-all flex flex-col justify-between space-y-4 group bg-slate-950/40"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          page.isPublished !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {page.isPublished !== false ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-[11px] text-text-secondary font-mono">
                        /{page.slug}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                      {page.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {page.seoDescription || page.title}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={`/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-text-secondary hover:text-white flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Live
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="px-3 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page.id, page.slug)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media Library Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary-400" /> Media Assets Library
              </h4>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 h-28 cursor-pointer hover:border-primary-500 transition-all"
                  onClick={() => {
                    setForm((p) => ({ ...p, imageUrl: asset.url }));
                    setShowMediaPicker(false);
                  }}
                >
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="btn-primary text-[10px] px-2 py-1 rounded-md font-bold">Select</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyImageUrl(asset.url);
                      }}
                      className="p-1 bg-white/20 hover:bg-white/30 rounded-md text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
