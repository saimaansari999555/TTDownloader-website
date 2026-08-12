'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Music, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchAudio } from '@/lib/api';
import AdSlot from '@/components/AdSlot';
import { useSettings } from '@/hooks/useSettings';

export default function AudioDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { settings } = useSettings();

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a TikTok URL');
      return;
    }
    if (!url.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAudio(url);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <form onSubmit={handleFetch} className="glass-panel p-2 md:p-3 flex flex-col md:flex-row gap-3 mb-6 shadow-xl">
        <div className="relative flex-grow flex items-center">
          <Search className="absolute left-4 text-text-secondary w-5 h-5" />
          <input 
            type="text" 
            placeholder="Paste TikTok video link for audio..."
            className="w-full glass-input rounded-xl py-4 pl-12 pr-4 text-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary rounded-xl px-10 py-4 flex items-center justify-center gap-2 text-lg font-bold whitespace-nowrap disabled:opacity-70 transition-transform active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Music className="w-5 h-5" />
              Extract
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-accent-500 bg-accent-500/10 px-4 py-3.5 rounded-xl border border-accent-500/20 mb-6 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /><p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      {result && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl shadow-xl border border-accent-500/20"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-32 h-32 shrink-0 border border-white/10 rounded-2xl overflow-hidden shadow-md">
                <img src={result.music_info?.cover || result.cover} alt="cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{result.music_info?.title || result.title}</h3>
                <p className="text-text-secondary text-sm mb-4">By @{result.music_info?.author || result.author?.unique_id}</p>
                <p className="text-text-secondary flex items-center gap-2 text-sm mb-6 font-medium">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Audio ready to download
                </p>
                
                <a 
                  href={result.music} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-3 btn-primary rounded-xl px-8 py-3.5 font-bold shadow-lg hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download MP3 Audio
                </a>
              </div>
            </div>
          </motion.div>
          <AdSlot placement="result" settings={settings} />
        </>
      )}
    </div>
  );
}
