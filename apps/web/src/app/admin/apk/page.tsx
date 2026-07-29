'use client';
import { useEffect, useState } from 'react';
import { Package, Plus, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { getAllApks, createApk, deleteApk } from '@/lib/api';

const emptyForm = { version: '', title: '', description: '', downloadUrl: '', fileSize: '', changelog: '' };

export default function AdminApk() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getAllApks().then(setReleases).catch(() => setReleases([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createApk(form);
      setForm(emptyForm); setShowForm(false); load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create release');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this APK release?')) return;
    await deleteApk(id);
    setReleases(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">APK Manager</h1>
          <p className="text-text-secondary">Manage Android app releases.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary rounded-xl px-5 py-3 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Release
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-panel p-6 rounded-2xl space-y-5">
          <h3 className="text-lg font-bold text-white">New APK Release</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm text-text-secondary mb-2">Version *</label><input required className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="1.0.0" value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} /></div>
            <div><label className="block text-sm text-text-secondary mb-2">Title *</label><input required className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="TTDownloader v1.0.0" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="md:col-span-2"><label className="block text-sm text-text-secondary mb-2">Download URL *</label><input required className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="https://..." value={form.downloadUrl} onChange={e => setForm(p => ({ ...p, downloadUrl: e.target.value }))} /></div>
            <div><label className="block text-sm text-text-secondary mb-2">File Size</label><input className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="15.2 MB" value={form.fileSize} onChange={e => setForm(p => ({ ...p, fileSize: e.target.value }))} /></div>
            <div><label className="block text-sm text-text-secondary mb-2">Description</label><input className="w-full glass-input rounded-xl py-2.5 px-4" placeholder="Short description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="md:col-span-2"><label className="block text-sm text-text-secondary mb-2">Changelog</label><textarea rows={3} className="w-full glass-input rounded-xl py-2.5 px-4 resize-none" placeholder="What's new in this version..." value={form.changelog} onChange={e => setForm(p => ({ ...p, changelog: e.target.value }))} /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary rounded-xl px-6 py-2.5 disabled:opacity-70">{submitting ? 'Publishing...' : 'Publish Release'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading...</div>
        ) : releases.length === 0 ? (
          <div className="p-16 text-center"><Package className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" /><p className="text-text-secondary">No APK releases yet</p></div>
        ) : (
          <div className="divide-y divide-white/5">
            {releases.map(r => (
              <div key={r.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><Package className="w-6 h-6 text-green-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{r.title}</p>
                      {r.isLatest && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Latest</span>}
                    </div>
                    <p className="text-text-secondary text-sm">v{r.version} {r.fileSize && `• ${r.fileSize}`}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
