'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, RefreshCw, Layout, 
  ArrowUp, ArrowDown, Type, Image as ImageIcon, 
  Heading, Globe, Save, CheckCircle, Smartphone
} from 'lucide-react';
import { getCustomPages, createCustomPage, updateCustomPage, deleteCustomPage } from '@/lib/api';
import SeoChecker from '@/components/SeoChecker';

const defaultLayout = [
  { id: '1', type: 'hero', title: 'Welcome to custom page', subtitle: 'Describe your page here', bgColor: '#1e293b' },
  { id: '2', type: 'heading', level: 'h2', text: 'Custom Section Heading' },
  { id: '3', type: 'paragraph', text: 'Write your page content paragraphs visually from the panel editor here.' }
];

const emptyForm = { title: '', slug: '', isPublished: true, seoTitle: '', seoDescription: '', seoKeywords: '' };

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Page Fields
  const [form, setForm] = useState(emptyForm);
  const [layout, setLayout] = useState<any[]>(defaultLayout);
  
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const load = () => {
    setLoading(true);
    getCustomPages().then(setPages).catch(() => setPages([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const pageData = {
      ...form,
      layout: JSON.stringify(layout)
    };
    try {
      if (editId) {
        await updateCustomPage(editId, pageData);
      } else {
        await createCustomPage(pageData);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      setShowEditor(false);
      setEditId(null);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save custom page');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (page: any) => {
    setForm({
      title: page.title,
      slug: page.slug,
      isPublished: page.isPublished,
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || '',
      seoKeywords: page.seoKeywords || ''
    });
    try {
      setLayout(JSON.parse(page.layout));
    } catch {
      setLayout(defaultLayout);
    }
    setEditId(page.id);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page forever?')) return;
    await deleteCustomPage(id);
    load();
  };

  // Layout Blocks Mutators
  const addBlock = (type: string) => {
    const id = Date.now().toString();
    let newBlock = {};
    if (type === 'heading') {
      newBlock = { id, type: 'heading', level: 'h2', text: 'New Section Heading' };
    } else if (type === 'paragraph') {
      newBlock = { id, type: 'paragraph', text: 'This is a new text block. Click to type and configure.' };
    } else if (type === 'image') {
      newBlock = { id, type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600', caption: 'Custom image description' };
    } else if (type === 'hero') {
      newBlock = { id, type: 'hero', title: 'Hero Banner Title', subtitle: 'A quick catchphrase to draw visitors in.', bgColor: '#8b5cf6' };
    } else if (type === 'spacer') {
      newBlock = { id, type: 'spacer', height: '40px' };
    }
    setLayout(prev => [...prev, newBlock]);
  };

  const removeBlock = (id: string) => {
    setLayout(prev => prev.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layout.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextLayout = [...layout];
    const temp = nextLayout[index];
    nextLayout[index] = nextLayout[targetIndex];
    nextLayout[targetIndex] = temp;
    setLayout(nextLayout);
  };

  const updateBlockContent = (id: string, updatedFields: any) => {
    setLayout(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Page Builder</h1>
          <p className="text-text-secondary">{pages.length} custom pages created</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => { setForm(emptyForm); setLayout(defaultLayout); setEditId(null); setShowEditor(true); }} className="btn-primary rounded-xl px-5 py-3 flex items-center gap-2 font-bold">
            <Plus className="w-5 h-5" /> Build New Page
          </button>
        </div>
      </div>

      {showEditor && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Main Visual Drag Editor panel */}
          <div className="xl:col-span-2 space-y-5">
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Layout className="w-5 h-5 text-primary-400" /> Visual Layout Editor</h3>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addBlock('hero')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> + Hero</button>
                  <button type="button" onClick={() => addBlock('heading')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white flex items-center gap-1"><Heading className="w-3.5 h-3.5" /> + Heading</button>
                  <button type="button" onClick={() => addBlock('paragraph')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white flex items-center gap-1"><Type className="w-3.5 h-3.5" /> + Text</button>
                  <button type="button" onClick={() => addBlock('image')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" /> + Image</button>
                  <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                  <button type="button" onClick={() => addBlock('downloader_tool')} className="px-2.5 py-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg text-xs font-bold">+ Downloader</button>
                  <button type="button" onClick={() => addBlock('audio_tool')} className="px-2.5 py-1.5 bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 rounded-lg text-xs font-bold">+ Audio</button>
                  <button type="button" onClick={() => addBlock('bulk_tool')} className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">+ Bulk</button>
                  <button type="button" onClick={() => addBlock('apk_tool')} className="px-2.5 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">+ APK</button>
                  <button type="button" onClick={() => addBlock('contact_tool')} className="px-2.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-bold">+ Contact</button>
                </div>
              </div>

              {/* Rendering Visual list of blocks */}
              <div className="space-y-4 min-h-[300px] border-2 border-dashed border-white/5 p-4 rounded-xl">
                {layout.map((block, idx) => (
                  <div key={block.id} className="relative p-5 bg-white/5 border border-white/5 rounded-xl group transition-all hover:border-primary-500/30">
                    {/* Block Action Controls */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/80 p-1.5 rounded-lg border border-white/10 z-20">
                      <button type="button" onClick={() => moveBlock(idx, 'up')} className="p-1 hover:text-white text-text-secondary"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => moveBlock(idx, 'down')} className="p-1 hover:text-white text-text-secondary"><ArrowDown className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => removeBlock(block.id)} className="p-1 hover:text-accent-400 text-text-secondary"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* Block Content Inputs */}
                    {block.type === 'hero' && (
                      <div className="space-y-3" style={{ borderLeft: `4px solid ${block.bgColor || '#8b5cf6'}` }}>
                        <input className="w-full bg-transparent font-black text-2xl text-white border-b border-transparent focus:border-white/20 pb-1 px-2" value={block.title} onChange={e => updateBlockContent(block.id, { title: e.target.value })} placeholder="Hero Heading" />
                        <input className="w-full bg-transparent text-sm text-text-secondary border-b border-transparent focus:border-white/20 pb-1 px-2" value={block.subtitle} onChange={e => updateBlockContent(block.id, { subtitle: e.target.value })} placeholder="Hero Subdescription" />
                        <div className="flex items-center gap-2 mt-2 px-2">
                          <span className="text-xs text-text-secondary font-bold">Theme Color:</span>
                          <input type="color" value={block.bgColor || '#8b5cf6'} onChange={e => updateBlockContent(block.id, { bgColor: e.target.value })} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                        </div>
                      </div>
                    )}

                    {block.type === 'downloader_tool' && (
                      <div className="py-2 px-4 border border-dashed border-primary-500/20 bg-primary-500/5 rounded-lg flex items-center justify-between text-primary-400 font-bold text-sm">
                        <span>🔌 TikTok Video Downloader Interface Box</span>
                        <span className="text-xs text-text-secondary font-medium">(Interactive elements will display on public page)</span>
                      </div>
                    )}

                    {block.type === 'audio_tool' && (
                      <div className="py-2 px-4 border border-dashed border-accent-500/20 bg-accent-500/5 rounded-lg flex items-center justify-between text-accent-400 font-bold text-sm">
                        <span>🔌 TikTok Audio Extractor Interface Box</span>
                        <span className="text-xs text-text-secondary font-medium">(Interactive elements will display on public page)</span>
                      </div>
                    )}

                    {block.type === 'bulk_tool' && (
                      <div className="py-2 px-4 border border-dashed border-blue-500/20 bg-blue-500/5 rounded-lg flex items-center justify-between text-blue-400 font-bold text-sm">
                        <span>🔌 Profile Bulk Downloader Interface Box</span>
                        <span className="text-xs text-text-secondary font-medium">(Interactive elements will display on public page)</span>
                      </div>
                    )}

                    {block.type === 'apk_tool' && (
                      <div className="py-2 px-4 border border-dashed border-green-500/20 bg-green-500/5 rounded-lg flex items-center justify-between text-green-400 font-bold text-sm">
                        <span>🔌 Android APK Release Box</span>
                        <span className="text-xs text-text-secondary font-medium">(Interactive elements will display on public page)</span>
                      </div>
                    )}

                    {block.type === 'contact_tool' && (
                      <div className="py-2 px-4 border border-dashed border-yellow-500/20 bg-yellow-500/5 rounded-lg flex items-center justify-between text-yellow-400 font-bold text-sm">
                        <span>🔌 Contact Submission Form Box</span>
                        <span className="text-xs text-text-secondary font-medium">(Interactive elements will display on public page)</span>
                      </div>
                    )}

                    {block.type === 'heading' && (
                      <div className="flex gap-3">
                        <select className="bg-transparent border border-white/10 rounded px-2 py-0.5 text-xs text-white" value={block.level || 'h2'} onChange={e => updateBlockContent(block.id, { level: e.target.value })}>
                          <option value="h1">H1</option>
                          <option value="h2">H2</option>
                          <option value="h3">H3</option>
                        </select>
                        <input className="w-full bg-transparent font-extrabold text-xl text-white border-b border-transparent focus:border-white/20 pb-1" value={block.text} onChange={e => updateBlockContent(block.id, { text: e.target.value })} />
                      </div>
                    )}

                    {block.type === 'paragraph' && (
                      <textarea rows={2} className="w-full bg-transparent text-text-secondary text-sm leading-relaxed border-b border-transparent focus:border-white/20 pb-1 resize-none" value={block.text} onChange={e => updateBlockContent(block.id, { text: e.target.value })} />
                    )}

                    {block.type === 'image' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1 rounded-lg overflow-hidden border border-white/10 h-28 flex items-center justify-center bg-black/45">
                          <img src={block.url} alt="block" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = 'https://placehold.co/100')} />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary">Image Source URL</label>
                            <input className="w-full bg-transparent text-xs text-white border-b border-white/10 focus:border-primary-500 py-1" value={block.url} onChange={e => updateBlockContent(block.id, { url: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary">Image Alternate Caption</label>
                            <input className="w-full bg-transparent text-xs text-text-secondary border-b border-white/10 focus:border-primary-500 py-1" value={block.caption} onChange={e => updateBlockContent(block.id, { caption: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Settings and SEO Controls Sidebar */}
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-400" /> Page Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Page Title *</label>
                <input required className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" placeholder="e.g. Terms of Service" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">URL Route Path *</label>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-text-secondary">
                  <span>/p/</span>
                  <input required className="w-full bg-transparent border-0 p-0 text-white outline-none" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Page SEO Title</label>
                <input className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" placeholder="Custom Browser Tab Title" value={form.seoTitle} onChange={e => setForm(p => ({ ...p, seoTitle: e.target.value }))} />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Page SEO Meta Description</label>
                <textarea rows={3} className="w-full glass-input rounded-xl py-2.5 px-4 text-sm resize-none" placeholder="Provide search summary description..." value={form.seoDescription} onChange={e => setForm(p => ({ ...p, seoDescription: e.target.value }))} />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Page SEO Meta Keywords</label>
                <input className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" placeholder="keywords, comma, separated" value={form.seoKeywords} onChange={e => setForm(p => ({ ...p, seoKeywords: e.target.value }))} />
              </div>

              <SeoChecker 
                title={form.seoTitle}
                description={form.seoDescription}
                keywords={form.seoKeywords}
              />


              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-white font-bold text-xs">Publish Status</p>
                  <p className="text-text-secondary text-[10px]">Allow page to be accessible by public routes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-white/10">
              <button type="submit" disabled={submitting} className="flex-1 btn-primary rounded-xl py-3 flex items-center justify-center gap-2 font-bold disabled:opacity-70">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editId ? 'Update Page' : 'Save & Publish'}
              </button>
              <button type="button" onClick={() => { setShowEditor(false); setEditId(null); }} className="px-4 py-3 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Pages Listing Grid */}
      {!showEditor && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-text-secondary flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-400" />
              <span>Retrieving pages list...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-20 text-center">
              <Layout className="w-16 h-16 text-text-secondary/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Custom Pages Built</h3>
              <p className="text-text-secondary text-sm">Create informational pages like DMCA, Privacy Policy, or Terms of Service visually above.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pages.map(page => (
                <div key={page.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/15 border border-primary-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <Layout className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">{page.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${page.isPublished ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs mt-0.5">Slug: <span className="text-primary-400">/p/{page.slug}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/5 text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Eye className="w-4 h-4" /></a>
                    <button onClick={() => handleEdit(page)} className="btn-secondary p-2.5 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(page.id)} className="p-2.5 rounded-xl text-accent-500 hover:bg-accent-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
