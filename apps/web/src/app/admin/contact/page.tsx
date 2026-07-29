'use client';
import { useEffect, useState } from 'react';
import { Mail, Trash2, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import { getContactMessages, api } from '@/lib/api';

export default function AdminContact() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const load = () => {
    setLoading(true);
    getContactMessages().then(setMessages).catch(() => setMessages([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await api.patch(`/contact/${id}/read`);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, isRead: true }));
  };

  const deleteMsg = async (id: string) => {
    await api.delete(`/contact/${id}`);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Inbox</h1>
          <p className="text-text-secondary">{messages.filter(m => !m.isRead).length} unread messages</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center"><Mail className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" /><p className="text-text-secondary">No messages yet</p></div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map(msg => (
                <div key={msg.id} onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg.id); }}
                  className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selected?.id === msg.id ? 'bg-white/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!msg.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />}
                        <p className={`font-medium text-sm truncate ${!msg.isRead ? 'text-white' : 'text-text-secondary'}`}>{msg.name}</p>
                      </div>
                      <p className="text-text-secondary text-xs truncate mt-0.5">{msg.subject}</p>
                      <p className="text-text-secondary text-xs mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }} className="p-1.5 text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.subject}</h3>
                  <p className="text-text-secondary text-sm mt-1">From: <span className="text-white">{selected.name}</span> ({selected.email})</p>
                  <p className="text-text-secondary text-xs mt-0.5">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                {selected.isRead && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-3.5 h-3.5" />Read</span>}
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="mt-4 flex items-center gap-2 btn-primary rounded-xl px-5 py-2.5 text-sm font-medium w-fit">
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Eye className="w-12 h-12 text-text-secondary/30 mb-3" />
              <p className="text-text-secondary">Select a message to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
