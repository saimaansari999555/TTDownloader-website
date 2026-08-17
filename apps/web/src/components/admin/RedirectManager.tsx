'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ArrowLeftRight,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Check,
  Power,
  Info,
  ShieldCheck,
  Play
} from 'lucide-react';
import { getRedirects, createRedirect, updateRedirect, deleteRedirect } from '@/lib/api';

interface RedirectItem {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_REDIRECTS: RedirectItem[] = [
  {
    id: 'redir-about',
    sourcePath: '/about',
    targetPath: '/about-us',
    statusCode: 301,
    isActive: true,
    notes: 'Permanent 301 redirect for About Us page migration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'redir-contact',
    sourcePath: '/contact',
    targetPath: '/contact-us',
    statusCode: 301,
    isActive: true,
    notes: 'Permanent 301 redirect for Contact Us page migration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const emptyForm = {
  id: '',
  sourcePath: '',
  targetPath: '',
  statusCode: 301,
  isActive: true,
  notes: '',
};

export default function RedirectManager() {
  const [redirects, setRedirects] = useState<RedirectItem[]>(DEFAULT_REDIRECTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | '301' | '302'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync cookie for ultra-fast middleware lookup (0ms)
  const syncCookie = useCallback((items: RedirectItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      const activeList = items
        .filter((r) => r.isActive)
        .map((r) => ({
          sourcePath: r.sourcePath,
          targetPath: r.targetPath,
          statusCode: r.statusCode || 301,
        }));
      document.cookie = `active_redirects=${encodeURIComponent(
        JSON.stringify(activeList)
      )}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.warn('Cookie sync error:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchList = async () => {
    setLoading(true);
    let initialList = DEFAULT_REDIRECTS;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('local_redirects');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = parsed;
            setRedirects(parsed);
          }
        }
      } catch (e) {
        console.warn('Local storage read error:', e);
      }
    }

    try {
      const data = await getRedirects();
      if (Array.isArray(data) && data.length > 0) {
        setRedirects(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('local_redirects', JSON.stringify(data));
        }
        syncCookie(data);
      } else {
        syncCookie(initialList);
      }
    } catch (e) {
      console.warn('API fetch notice, using fallback redirects:', e);
      syncCookie(initialList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Format path helper
  const normalizeInputPath = (p: string) => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setFormError(null);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: RedirectItem) => {
    setForm({
      id: item.id,
      sourcePath: item.sourcePath,
      targetPath: item.targetPath,
      statusCode: item.statusCode || 301,
      isActive: item.isActive,
      notes: item.notes || '',
    });
    setIsEditing(true);
    setFormError(null);
    setShowModal(true);
  };

  // Toggle Active State
  const handleToggleActive = async (item: RedirectItem) => {
    const updatedStatus = !item.isActive;
    const updated = redirects.map((r) => (r.id === item.id ? { ...r, isActive: updatedStatus } : r));
    setRedirects(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('local_redirects', JSON.stringify(updated));
    }
    syncCookie(updated);
    showToast(`Redirect "${item.sourcePath}" is now ${updatedStatus ? 'Active' : 'Inactive'}.`);

    try {
      await updateRedirect(item.id, { isActive: updatedStatus });
    } catch (err: any) {
      console.warn('Background API sync notice:', err);
    }
  };

  // Delete Redirect
  const handleDelete = async (id: string, source: string) => {
    if (!confirm(`Are you sure you want to delete redirect "${source}"?`)) return;

    const updated = redirects.filter((r) => r.id !== id);
    setRedirects(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('local_redirects', JSON.stringify(updated));
    }
    syncCookie(updated);
    showToast(`Redirect "${source}" deleted successfully.`);

    try {
      await deleteRedirect(id);
    } catch (err: any) {
      console.warn('Background API delete notice:', err);
    }
  };

  // Submit Create / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const source = normalizeInputPath(form.sourcePath);
    const target = normalizeInputPath(form.targetPath);

    if (!source || !target) {
      setFormError('Both Source URL and Destination URL are required.');
      return;
    }

    if (source.toLowerCase() === target.toLowerCase()) {
      setFormError('Source and Destination URLs cannot be identical.');
      return;
    }

    if (/^(javascript|data|vbscript):/i.test(target)) {
      setFormError('Invalid or dangerous destination URL scheme.');
      return;
    }

    // Loop detection with existing redirects
    const reverse = redirects.find(
      (r) =>
        r.id !== form.id &&
        r.isActive &&
        normalizeInputPath(r.sourcePath).toLowerCase() === target.toLowerCase()
    );
    if (reverse && normalizeInputPath(reverse.targetPath).toLowerCase() === source.toLowerCase()) {
      setFormError(
        `Redirect loop detected: "${source}" redirects to "${target}", but "${target}" already redirects back to "${source}".`
      );
      return;
    }

    setSubmitting(true);

    const payload: RedirectItem = {
      id: form.id || `redir-${Date.now()}`,
      sourcePath: source,
      targetPath: target,
      statusCode: Number(form.statusCode) || 301,
      isActive: form.isActive,
      notes: form.notes.trim() || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedList: RedirectItem[];
    if (isEditing && form.id) {
      updatedList = redirects.map((r) => (r.id === form.id ? payload : r));
    } else {
      updatedList = [payload, ...redirects.filter((r) => r.sourcePath.toLowerCase() !== source.toLowerCase())];
    }

    setRedirects(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('local_redirects', JSON.stringify(updatedList));
    }
    syncCookie(updatedList);

    setShowModal(false);
    setForm(emptyForm);
    setSubmitting(false);
    showToast(isEditing ? 'Redirect updated successfully!' : 'New redirect created successfully!');

    try {
      if (isEditing && form.id) {
        await updateRedirect(form.id, payload);
      } else {
        await createRedirect(payload);
      }
    } catch (err: any) {
      console.warn('Background API save notice:', err);
    }
  };

  // Filtering & Search
  const filteredList = useMemo(() => {
    return redirects.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.sourcePath.toLowerCase().includes(q) ||
        item.targetPath.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === 'active') return item.isActive;
      if (statusFilter === 'inactive') return !item.isActive;
      if (statusFilter === '301') return item.statusCode === 301;
      if (statusFilter === '302') return item.statusCode === 302;
      return true;
    });
  }, [redirects, search, statusFilter]);

  // Summary Metrics
  const totalCount = redirects.length;
  const activeCount = redirects.filter((r) => r.isActive).length;
  const permanentCount = redirects.filter((r) => r.statusCode === 301).length;
  const temporaryCount = redirects.filter((r) => r.statusCode === 302).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-primary-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Total Rules</span>
            <ArrowLeftRight className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{totalCount}</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Active Rules</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{activeCount}</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">301 Permanent</span>
            <ShieldCheck className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{permanentCount}</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">302 Temporary</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{temporaryCount}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search source, destination, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input rounded-xl py-2 pl-9 pr-4 text-sm text-white font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'inactive', label: 'Inactive' },
                { id: '301', label: '301 Perm' },
                { id: '302', label: '302 Temp' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchList}
            className="p-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            title="Refresh redirects"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-primary rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Redirect
          </button>
        </div>
      </div>

      {/* Redirects Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        {loading && redirects.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm font-medium">Loading redirects...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-16 text-center">
            <ArrowLeftRight className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              {search || statusFilter !== 'all' ? 'No matching redirects found' : 'No redirects configured yet'}
            </h3>
            <p className="text-text-secondary text-xs max-w-sm mx-auto mb-5">
              {search || statusFilter !== 'all'
                ? 'Try clearing your search query or filters to see all redirects.'
                : 'Create server-side 301 and 302 URL redirects to preserve SEO rankings and handle slug updates.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn-primary rounded-xl px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Your First Redirect
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="p-4">Source URL</th>
                  <th className="p-4">Destination Target</th>
                  <th className="p-4 text-center">Type</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredList.map((item) => {
                  const isExternal = item.targetPath.startsWith('http');
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        !item.isActive ? 'opacity-60 bg-black/20' : ''
                      }`}
                    >
                      {/* Source */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 text-white border border-white/10">
                            {item.sourcePath}
                          </code>
                          <a
                            href={item.sourcePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-text-secondary hover:text-primary-400 hover:bg-white/5 transition-colors"
                            title="Test redirect in new tab"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-text-secondary text-xs font-bold">→</span>
                          <code className="text-xs font-mono px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-300 border border-primary-500/20 max-w-xs truncate inline-block">
                            {item.targetPath}
                          </code>
                          {isExternal && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary font-mono border border-white/10">
                              <ExternalLink className="w-2.5 h-2.5" /> External
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.statusCode === 301
                              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.statusCode} {item.statusCode === 301 ? 'Permanent' : 'Temporary'}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            item.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'
                          }`}
                          title="Click to toggle active / inactive"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-text-secondary'
                            }`}
                          />
                          {item.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Notes */}
                      <td className="p-4 text-xs text-text-secondary max-w-[200px] truncate">
                        {item.notes || <span className="italic opacity-40">None</span>}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit Redirect"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.sourcePath)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Redirect"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-primary-400" />
                {isEditing ? 'Edit Redirect Rule' : 'Create New Redirect Rule'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-white p-1 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Source Path */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Source URL Path *
                  </label>
                  <span className="text-[11px] text-text-secondary font-medium">The old or incoming path</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. /about or /blog/old-article"
                  value={form.sourcePath}
                  onChange={(e) => setForm((p) => ({ ...p, sourcePath: e.target.value }))}
                  className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white font-mono"
                  autoFocus
                />
              </div>

              {/* Destination Target */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Destination Target URL *
                  </label>
                  <span className="text-[11px] text-text-secondary font-medium">Internal path or full HTTPS URL</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. /about-us or https://tik-tokdownloader.xyz/video"
                  value={form.targetPath}
                  onChange={(e) => setForm((p) => ({ ...p, targetPath: e.target.value }))}
                  className="w-full glass-input rounded-xl py-3 px-4 text-sm text-white font-mono"
                />
              </div>

              {/* Redirect Type & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Redirect Type
                  </label>
                  <select
                    value={form.statusCode}
                    onChange={(e) => setForm((p) => ({ ...p, statusCode: Number(e.target.value) }))}
                    className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white font-semibold"
                  >
                    <option value={301} className="bg-slate-900 text-white">
                      301 - Permanent (Recommended for SEO)
                    </option>
                    <option value={302} className="bg-slate-900 text-white">
                      302 - Temporary (Found / Temp Move)
                    </option>
                    <option value={307} className="bg-slate-900 text-white">
                      307 - Temporary Redirect (Preserve Method)
                    </option>
                    <option value={308} className="bg-slate-900 text-white">
                      308 - Permanent Redirect (Preserve Method)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <div className="flex items-center gap-2 py-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                        className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-0 w-4 h-4"
                      />
                      <span>{form.isActive ? 'Active (Live on website)' : 'Inactive (Disabled)'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Administrative Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Changed About page slug from /about to /about-us"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full glass-input rounded-xl py-2.5 px-3 text-xs text-white"
                />
              </div>

              {/* Info Box */}
              <div className="p-3 rounded-xl bg-primary-500/5 border border-primary-500/20 text-text-secondary text-[11px] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span>
                  <strong>SEO Best Practice:</strong> Use <strong>301 Permanent</strong> for permanent URL updates so
                  search engines transfer authority, canonical value, and traffic directly to the new URL without losing
                  rankings.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary rounded-xl px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    'Saving...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> {isEditing ? 'Save Changes' : 'Create Redirect'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
