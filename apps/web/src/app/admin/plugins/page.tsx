'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, ToggleLeft, ToggleRight, Trash2, Edit3, 
  Puzzle, Save, ShieldAlert, Code2, RefreshCw, FileCode
} from 'lucide-react';
import { getPlugins, togglePluginActive, createPlugin, updatePlugin, deletePlugin } from '@/lib/api';

const defaultForm = { name: '', slug: '', description: '', version: '1.0.0', headCode: '', footerCode: '' };

export default function AdminPlugins() {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getPlugins().then(setPlugins).catch(() => setPlugins([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id: string) => {
    try {
      await togglePluginActive(id);
      load();
    } catch {
      alert('Failed to toggle plugin status.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await updatePlugin(editId, form);
      } else {
        await createPlugin({
          ...form,
          slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        });
      }
      setShowForm(false);
      setEditId(null);
      setForm(defaultForm);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save plugin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plugin: any) => {
    setForm({
      name: plugin.name,
      slug: plugin.slug,
      description: plugin.description || '',
      version: plugin.version || '1.0.0',
      headCode: plugin.headCode || '',
      footerCode: plugin.footerCode || '',
    });
    setEditId(plugin.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Uninstall and remove this plugin permanently?')) return;
    await deletePlugin(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Plugins & Hooks</h1>
          <p className="text-text-secondary">Extend site functionality by adding scripts, custom analytics trackers, notifications, or features.</p>
        </div>
        <button 
          onClick={() => { setForm(defaultForm); setEditId(null); setShowForm(!showForm); }} 
          className="btn-primary rounded-xl px-5 py-3 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Install Custom Plugin
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl space-y-5 max-w-3xl border border-primary-500/20 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <FileCode className="w-5 h-5 text-primary-400" /> {editId ? 'Configure Plugin Details' : 'Install Developer Extension Code'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Plugin Display Name *</label>
              <input required className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" placeholder="e.g. Google Analytics" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Version</label>
              <input required className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" placeholder="1.0.0" value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text-secondary mb-2">Short Description</label>
              <input className="w-full glass-input rounded-xl py-2.5 px-4 text-sm" placeholder="Brief summary of what this code does..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5"><Code2 className="w-4 h-4 text-primary-400" /> Page Header Hook Injection Code (&lt;head&gt;)</label>
              <textarea rows={4} className="w-full glass-input rounded-xl py-2.5 px-4 text-xs font-mono resize-none" placeholder="Paste HTML/JS tags to run inside <head> tag..." value={form.headCode} onChange={e => setForm(p => ({ ...p, headCode: e.target.value }))} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5"><Code2 className="w-4 h-4 text-accent-400" /> Page Footer Hook Injection Code (End of &lt;body&gt;)</label>
              <textarea rows={4} className="w-full glass-input rounded-xl py-2.5 px-4 text-xs font-mono resize-none" placeholder="Paste HTML/JS tags to run right before </body> closes..." value={form.footerCode} onChange={e => setForm(p => ({ ...p, footerCode: e.target.value }))} />
            </div>
          </div>

          <div className="flex gap-2.5 pt-4 border-t border-white/10">
            <button type="submit" disabled={submitting} className="btn-primary rounded-xl px-6 py-3 flex items-center gap-2 font-bold disabled:opacity-70">
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? 'Save Configuration' : 'Install Plugin'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-3 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-all">Cancel</button>
          </div>
        </form>
      )}

      {/* Plugins Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-text-secondary flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-400" />
            <span>Loading active widgets and extensions...</span>
          </div>
        ) : plugins.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl">
            <Puzzle className="w-16 h-16 text-text-secondary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Extensions Installed</h3>
            <p className="text-text-secondary text-sm">Add analytics trackers, chats, detectors, or floats from developer settings above.</p>
          </div>
        ) : (
          plugins.map(plugin => (
            <div 
              key={plugin.id} 
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                plugin.isActive 
                  ? 'border-primary-500/20 bg-primary-950/5 shadow-md shadow-primary-500/5' 
                  : 'border-white/5 bg-slate-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Puzzle className={`w-5 h-5 ${plugin.isActive ? 'text-primary-400 animate-pulse' : 'text-text-secondary'}`} />
                    <h3 className="font-bold text-white text-base leading-tight">{plugin.name}</h3>
                  </div>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-bold text-text-secondary">v{plugin.version}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed mb-4 min-h-[48px]">{plugin.description || 'Custom developer-installed script hook widget.'}</p>
                
                {/* Active codes indicator */}
                <div className="flex gap-4 text-[10px] text-text-secondary mb-5 font-bold">
                  {plugin.headCode && <span className="flex items-center gap-1 text-primary-400">● Injects Header</span>}
                  {plugin.footerCode && <span className="flex items-center gap-1 text-accent-400">● Injects Footer</span>}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <button 
                  onClick={() => handleToggle(plugin.id)} 
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    plugin.isActive ? 'text-green-400 hover:text-green-300' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {plugin.isActive ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-white/20" />}
                  <span>{plugin.isActive ? 'Active' : 'Inactive'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(plugin)} className="p-2.5 rounded-xl border border-white/5 hover:border-white/10 text-text-secondary hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(plugin.id)} className="p-2.5 rounded-xl text-accent-500 hover:bg-accent-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
