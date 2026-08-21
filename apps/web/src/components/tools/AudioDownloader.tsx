'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Music, CheckCircle, AlertCircle, Clipboard, X, Zap, Headphones, ShieldCheck } from 'lucide-react';
import { fetchAudio } from '@/lib/api';
import AdSlot from '@/components/AdSlot';
import { useSettings } from '@/hooks/useSettings';

export default function AudioDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { settings } = useSettings();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError(null);
      }
    } catch {
      // Clipboard permission unsupported
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setResult(null);
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a TikTok URL to extract audio');
      return;
    }
    if (!trimmed.includes('tiktok.com')) {
      setError('Please enter a valid TikTok video URL');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAudio(trimmed);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extract audio. The video may be private or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      {/* Search Input Form */}
      <form onSubmit={handleFetch} className="relative bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-2 md:p-2.5 shadow-2xl shadow-black/60 transition-all duration-200 mb-4">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          <div className="relative flex-grow flex items-center min-w-0">
            <Search className="absolute left-4 text-slate-400 w-5 h-5 shrink-0 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Paste TikTok link to extract audio & MP3..."
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl py-3.5 pl-12 pr-20 text-base md:text-lg transition-all duration-200 placeholder:text-slate-500 outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            {/* Quick Action inside Input */}
            <div className="absolute right-3 flex items-center gap-1.5">
              {url ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-md transition-all shadow-sm"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-3 h-3" />
                  Paste
                </button>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 text-base md:text-lg font-bold whitespace-nowrap disabled:opacity-60 transition-transform active:scale-[0.98] cursor-pointer shrink-0"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting...</span>
              </div>
            ) : (
              <>
                <Music className="w-5 h-5" />
                <span>Extract MP3</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Trust Micro Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium mb-6">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" /> Instant MP3 Extraction
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" /> High-Bitrate Audio
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Free Online
        </span>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 text-red-300 bg-red-950/40 border border-red-800/60 px-4 py-3 rounded-xl mb-6 shadow-md text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/60 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-28 h-28 shrink-0 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                {(result.music_info?.cover || result.cover) ? (
                  <img src={result.music_info?.cover || result.cover} alt="audio cover" className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-10 h-10 text-indigo-400" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white drop-shadow" />
                </div>
              </div>
              
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <CheckCircle className="w-4 h-4" /> Audio Track Ready
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-2">
                  {result.music_info?.title || result.title || 'Extracted TikTok Audio'}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  By @{result.music_info?.author || result.author?.unique_id || 'Creator'}
                </p>
                
                <a 
                  href={result.music} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-indigo-500/25 group cursor-pointer"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download MP3 Audio</span>
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
