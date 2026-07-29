'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchVideo } from '@/lib/api';
import AdSlot from '@/components/AdSlot';

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
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
      const data = await fetchVideo(url);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching the video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <form onSubmit={handleDownload} className="glass-panel p-2 md:p-3 flex flex-col md:flex-row gap-3 shadow-xl mb-6">
        <div className="relative flex-grow flex items-center">
          <Search className="absolute left-4 text-text-secondary w-5 h-5" />
          <input 
            type="text" 
            placeholder="Paste TikTok video link here..."
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
              <Download className="w-5 h-5" />
              Download
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl shadow-xl border border-primary-500/20"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 rounded-xl overflow-hidden relative shadow-md">
              <img src={result.cover} alt="cover" className="w-full h-auto object-cover aspect-[9/16]" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{result.title}</h3>
                <p className="text-text-secondary flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4.5 h-4.5 text-green-400" /> Ready to download
                </p>
              </div>

              <div className="space-y-3 mt-6">
                <a 
                  href={result.play} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-colors group"
                >
                  <div>
                    <span className="block font-bold text-white">Download Video (MP4)</span>
                    <span className="text-xs text-text-secondary">No Watermark</span>
                  </div>
                  <Download className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform" />
                </a>

                {result.hdplay && (
                  <a 
                    href={result.hdplay} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 p-4 rounded-xl transition-colors group"
                  >
                    <div>
                      <span className="block font-bold text-white text-primary-300">Download HD Video</span>
                      <span className="text-xs text-primary-400 font-semibold">Highest Quality HD MP4</span>
                    </div>
                    <Download className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
