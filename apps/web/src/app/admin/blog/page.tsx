'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, RefreshCw, FileText, Upload, Image as ImageIcon, X, Copy, Check } from 'lucide-react';
import { getAdminPosts, deletePost, api } from '@/lib/api';

const emptyForm = { title: '', slug: '', content: '', summary: '', status: 'DRAFT', imageUrl: '' };

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('uploaded_media_assets') : null;
    if (saved) {
      try { setMediaAssets(JSON.parse(saved)); } catch (e) {}
    }
  }, [showMediaPicker, showEditor]);

  const saveToMediaLibrary = (fileOrUrlName: string, url: string) => {
    if (typeof window === 'undefined' || !url) return;
    try {
      const saved = localStorage.getItem('uploaded_media_assets');
      const list = saved ? JSON.parse(saved) : [];
      const exists = list.some((item: any) => item.url === url);
      if (!exists) {
        const newAsset = {
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: fileOrUrlName || 'blog-image.png',
          url: url,
          type: 'image/png',
          size: 'Uploaded',
          date: new Date().toISOString().split('T')[0],
        };
        const updated = [newAsset, ...list];
        localStorage.setItem('uploaded_media_assets', JSON.stringify(updated));
        setMediaAssets(updated);
      }
    } catch (e) {}
  };

  const load = () => {
    setLoading(true);
    getAdminPosts()
      .then(res => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('local_blog_posts') || '[]') : [];
        const apiPosts = Array.isArray(res) ? res : [];
        const combined = [...apiPosts, ...local];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.slug === v.slug) === i);
        setPosts(unique);
        if (typeof window !== 'undefined' && unique.length > 0) {
          localStorage.setItem('local_blog_posts', JSON.stringify(unique));
        }
      })
      .catch(() => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('local_blog_posts') || '[]') : [];
        setPosts(local);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setForm(p => ({ ...p, imageUrl: resultUrl }));
          saveToMediaLibrary(file.name, resultUrl);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const generatedSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      if (form.imageUrl) {
        saveToMediaLibrary(`blog-${generatedSlug}.png`, form.imageUrl);
      }

      const postPayload = {
        title: form.title,
        slug: generatedSlug,
        content: form.content,
        summary: form.summary,
        status: form.status,
        imageUrl: form.imageUrl,
        featuredImage: form.imageUrl ? { url: form.imageUrl } : null,
        publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : null,
      };

      const targetId = editId || 'post-' + Date.now();

      const localItem = {
        id: targetId,
        ...postPayload,
        createdAt: new Date().toISOString(),
        author: { username: 'admin' }
      };

      // 1. Immediately update LocalStorage & State
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('local_blog_posts') || '[]');
        let updatedLocal;
        if (editId) {
          updatedLocal = local.map((p: any) => p.id === editId ? { ...p, ...localItem } : p);
        } else {
          updatedLocal = [localItem, ...local.filter((p: any) => p.slug !== generatedSlug)];
        }
        localStorage.setItem('local_blog_posts', JSON.stringify(updatedLocal));
      }

      // 2. Reset form & close editor instantly
      setForm(emptyForm);
      setShowEditor(false);
      setEditId(null);

      // 3. API sync non-blocking with 2s race timeout so form never hangs
      const apiCall = editId && !editId.startsWith('post-')
        ? api.put(`/blog/posts/${editId}`, postPayload)
        : api.post('/blog/posts', postPayload);

      await Promise.race([
        apiCall,
        new Promise(res => setTimeout(res, 2000))
      ]).catch(err => {
        console.warn('Backend sync saved locally:', err);
      });
    } catch (err: any) {
      console.warn('Form submit handler warning:', err);
    } finally {
      setSubmitting(false);
      load();
    }
  };

  const handleEdit = (post: any) => {
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      summary: post.summary || '',
      status: post.status,
      imageUrl: post.imageUrl || post.featuredImage?.url || '',
    });
    setEditId(post.id);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('local_blog_posts') || '[]');
      const updated = local.filter((p: any) => p.id !== id);
      localStorage.setItem('local_blog_posts', JSON.stringify(updated));
    }
    await deletePost(id).catch(() => {});
    load();
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
          <p className="text-text-secondary">{posts.length} posts total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowEditor(true); }} className="btn-primary rounded-xl px-5 py-3 flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Post
          </button>
        </div>
      </div>

      {showEditor && (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-5 border border-primary-500/30">
          <h3 className="text-lg font-bold text-white">{editId ? 'Edit Post' : 'Create New Post'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-text-secondary mb-2">Title *</label>
              <input required className="w-full glass-input rounded-xl py-3 px-4 text-white font-medium text-base" placeholder="Post title..." value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Slug</label>
              <input className="w-full glass-input rounded-xl py-3 px-4 text-white font-mono text-sm" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Status</label>
              <select className="w-full glass-input rounded-xl py-3 px-4 text-white font-medium text-sm" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="DRAFT" className="bg-slate-900 text-white">Draft</option>
                <option value="PUBLISHED" className="bg-slate-900 text-white">Published</option>
              </select>
            </div>

            {/* Featured Image Selection & Direct Upload */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="block text-sm font-semibold text-text-secondary">Featured Image (Saved to Media Library)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-xs text-white font-bold flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-lg transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload from Computer
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                    className="text-xs text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1.5 bg-primary-500/15 px-3 py-1.5 rounded-lg border border-primary-500/30"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Media Library
                  </button>
                </div>
              </div>

              <input 
                type="text"
                className="w-full glass-input rounded-xl py-3 px-4 text-white font-mono text-sm" 
                placeholder="Or paste image URL (e.g. https://...)" 
                value={form.imageUrl} 
                onChange={e => {
                  const val = e.target.value;
                  setForm(p => ({ ...p, imageUrl: val }));
                  if (val) saveToMediaLibrary('pasted-image.png', val);
                }} 
              />

              {form.imageUrl && (
                <div className="mt-3 flex items-start gap-4 p-3 rounded-xl glass-panel border border-primary-500/30">
                  <div className="h-28 w-44 rounded-lg overflow-hidden border border-white/20 shrink-0 relative">
                    <img src={form.imageUrl} alt="Post Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">Image Preview Ready</p>
                    <p className="text-xs font-mono text-text-secondary truncate">{form.imageUrl}</p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copyImageUrl(form.imageUrl)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          copiedUrl ? 'bg-green-500 text-white' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30'
                        }`}
                      >
                        {copiedUrl ? <><Check className="w-3.5 h-3.5" /> URL Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Image URL</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, imageUrl: '' }))}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Picker Modal */}
              {showMediaPicker && (
                <div className="p-4 glass-panel rounded-2xl border border-primary-500/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Select Image from Media Library</p>
                    <button type="button" onClick={() => setShowMediaPicker(false)} className="text-xs text-text-secondary hover:text-white">Close</button>
                  </div>
                  {mediaAssets.length === 0 ? (
                    <p className="text-xs text-text-secondary py-2 text-center">No media uploads found in library. Use "Upload from Computer" above.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1">
                      {mediaAssets.map((asset: any) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setForm(p => ({ ...p, imageUrl: asset.url }));
                            setShowMediaPicker(false);
                          }}
                          className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-primary-500 cursor-pointer relative group transition-all"
                        >
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-2">Summary</label>
              <input className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="Short description for listing..." value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-2">Content *</label>
              <textarea required rows={10} className="w-full glass-input rounded-xl py-3 px-4 resize-none font-mono text-sm" placeholder="Write your blog content here..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary rounded-xl px-6 py-2.5 disabled:opacity-70">{submitting ? 'Saving...' : editId ? 'Update Post' : 'Publish Post'}</button>
            <button type="button" onClick={() => { setShowEditor(false); setEditId(null); }} className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5">Cancel</button>
          </div>
        </form>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center"><FileText className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" /><p className="text-text-secondary">No blog posts yet. Create one above!</p></div>
        ) : (
          <table className="w-full text-left">
            <thead><tr className="border-b border-white/10 text-text-secondary text-sm">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {posts.map(post => {
                const img = post.imageUrl || post.featuredImage?.url;
                return (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {img ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                          <img src={img} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary text-xs font-bold">No Img</div>
                      )}
                    </td>
                    <td className="p-4"><p className="text-white font-medium">{post.title}</p><p className="text-text-secondary text-xs mt-0.5">/blog/{post.slug}</p></td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{post.status}</span></td>
                    <td className="p-4 text-text-secondary text-sm">{new Date(post.createdAt || post.publishedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a href={`/blog/${post.slug}`} target="_blank" className="p-2 text-text-secondary hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"><Eye className="w-4 h-4" /></a>
                        <button onClick={() => handleEdit(post)} className="p-2 text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

