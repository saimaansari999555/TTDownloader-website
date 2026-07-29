'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, RefreshCw, FileText } from 'lucide-react';
import { getAdminPosts, deletePost, api } from '@/lib/api';

const emptyForm = { title: '', slug: '', content: '', summary: '', status: 'DRAFT' };

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAdminPosts()
      .then(res => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('local_blog_posts') || '[]') : [];
        const combined = [...(Array.isArray(res) ? res : []), ...local];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.slug === v.slug) === i);
        setPosts(unique);
      })
      .catch(() => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('local_blog_posts') || '[]') : [];
        setPosts(local);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const generatedSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const postPayload = {
      title: form.title,
      slug: generatedSlug,
      content: form.content,
      summary: form.summary,
      status: form.status,
      publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : null,
    };

    const localItem = {
      id: editId || 'post-' + Date.now(),
      ...postPayload,
      createdAt: new Date().toISOString(),
      author: { username: 'admin' }
    };

    try {
      if (editId) {
        await api.put(`/blog/posts/${editId}`, postPayload);
      } else {
        await api.post('/blog/posts', postPayload);
      }
    } catch (err: any) {
      console.warn('API save fallback to local:', err);
    }

    // Always update local storage as reliable backup
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

    setForm(emptyForm);
    setShowEditor(false);
    setEditId(null);
    setSubmitting(false);
    load();
  };

  const handleEdit = (post: any) => {
    setForm({ title: post.title, slug: post.slug, content: post.content, summary: post.summary || '', status: post.status });
    setEditId(post.id); setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await deletePost(id); load();
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
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-5">
          <h3 className="text-lg font-bold text-white">{editId ? 'Edit Post' : 'Create New Post'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-2">Title *</label>
              <input required className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="Post title..." value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Slug</label>
              <input className="w-full glass-input rounded-xl py-2.5 px-4" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Status</label>
              <select className="w-full glass-input rounded-xl py-2.5 px-4" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
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
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4"><p className="text-white font-medium">{post.title}</p><p className="text-text-secondary text-xs mt-0.5">/blog/{post.slug}</p></td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{post.status}</span></td>
                  <td className="p-4 text-text-secondary text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/blog/${post.slug}`} target="_blank" className="p-2 text-text-secondary hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"><Eye className="w-4 h-4" /></a>
                      <button onClick={() => handleEdit(post)} className="p-2 text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
