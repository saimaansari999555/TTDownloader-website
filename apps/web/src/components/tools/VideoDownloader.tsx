'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, CheckCircle, AlertCircle, Clipboard, X, Sparkles, ShieldCheck, Zap, Music } from 'lucide-react';
import { fetchVideo } from '@/lib/api';
import AdSlot from '@/components/AdSlot';
import { useSettings } from '@/hooks/useSettings';

export default function VideoDownloader() {
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
      // Clipboard permission denied or unsupported
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setResult(null);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please paste a TikTok video URL to start');
      return;
    }
    if (!trimmed.includes('tiktok.com')) {
      setError('Please enter a valid TikTok link (e.g. https://www.tiktok.com/@user/video/...)');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchVideo(trimmed);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to retrieve video. The link might be private or removed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      {/* Search Input Box */}
      <form onSubmit={handleDownload} className="relative bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-2 md:p-2.5 shadow-2xl shadow-black/60 transition-all duration-200 mb-4">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          <div className="relative flex-grow flex items-center min-w-0">
            <Search className="absolute left-4 text-slate-400 w-5 h-5 shrink-0 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Paste TikTok video link here..."
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl py-3.5 pl-12 pr-20 text-base md:text-lg transition-all duration-200 placeholder:text-slate-500 outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            {/* Quick Action Buttons inside Input */}
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
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Trust Micro Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium mb-6">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" /> Instant Processing
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> No Watermark HD
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Free & Secure
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 text-red-300 bg-red-950/40 border border-red-800/60 px-4 py-3 rounded-xl mb-6 shadow-md text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Download Result Card */}
      {result && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/60 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {result.cover && (
                <div className="w-full md:w-44 rounded-xl overflow-hidden relative shadow-lg bg-slate-950 border border-slate-800 shrink-0">
                  <img src={result.cover} alt="video thumbnail" className="w-full h-auto object-cover aspect-[9/16]" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[11px] font-semibold bg-black/75 text-white backdrop-blur rounded">
                    TikTok HD
                  </span>
                </div>
              )}
              
              <div className="flex-1 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    <CheckCircle className="w-4 h-4" /> Ready to Save
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {result.title || 'TikTok Video Ready'}
                  </h3>
                  {result.author && (
                    <p className="text-sm text-slate-400 mb-4">
                      Creator: <span className="text-slate-200 font-medium">@{result.author}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 mt-4">
                  <a 
                    href={result.play} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-indigo-500/25 group"
                  >
                    <div>
                      <span className="block font-bold">Download Video (MP4)</span>
                      <span className="text-xs text-indigo-200">No Watermark • Standard Quality</span>
                    </div>
                    <Download className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform" />
                  </a>

                  {result.hdplay && (
                    <a 
                      href={result.hdplay} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-600/80 text-white px-5 py-3.5 rounded-xl font-semibold transition-all group"
                    >
                      <div>
                        <span className="block font-bold text-cyan-300">Download HD Video (Full Resolution)</span>
                        <span className="text-xs text-slate-400">Crisp High Definition MP4</span>
                      </div>
                      <Download className="w-5 h-5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  )}

                  {result.music && (
                    <a 
                      href={result.music} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-slate-200 px-5 py-3 rounded-xl text-sm font-medium transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-slate-400" />
                        <span>Download MP3 Audio Track</span>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          <AdSlot placement="result" settings={settings} />
        </>
      )}
    </div>
  );
}
