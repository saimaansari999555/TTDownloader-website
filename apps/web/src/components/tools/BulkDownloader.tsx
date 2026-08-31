'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Download, AlertCircle, Play, ChevronLeft, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { fetchUserVideos } from '@/lib/api';

export default function BulkDownloader() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [cursor, setCursor] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const extractCleanUser = (input: string) => {
    let raw = input.trim();
    if (raw.includes('tiktok.com')) {
      const match = raw.match(/@([a-zA-Z0-9_.-]+)/);
      if (match && match[1]) return match[1];
    }
    return raw.replace(/^@+/, '').split('?')[0].split('/')[0].trim();
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setResult(null); 
    setCursor(0);
    setCurrentPage(1);
    
    const cleanUser = extractCleanUser(username);
    if (!cleanUser) { 
      setError('Please enter a valid TikTok username (e.g. khaby.lame) or profile link'); 
      return; 
    }
    setLoading(true);
    try {
      const data = await fetchUserVideos(cleanUser);
      setResult(data);
      setCursor(data.cursor || 0);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Failed to fetch user profile. Please check the username and try again.');
    } finally { 
      setLoading(false); 
    }
  };

  const loadMoreFromApi = async () => {
    if (!result || loadingMore || !result.hasMore) return false;
    setLoadingMore(true);
    try {
      const cleanUser = username.trim().replace('@', '');
      const data = await fetchUserVideos(cleanUser, cursor);
      setResult((prev: any) => ({
        ...prev,
        videos: [...prev.videos, ...data.videos],
        cursor: data.cursor,
        hasMore: data.hasMore
      }));
      setCursor(data.cursor);
      setLoadingMore(false);
      return true;
    } catch (e) {
      setLoadingMore(false);
      return false;
    }
  };

  const videos = result?.videos || [];
  const totalPages = Math.ceil(videos.length / pageSize);
  const currentVideos = videos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber > totalPages && result?.hasMore) {
      const success = await loadMoreFromApi();
      if (success) {
        setCurrentPage(pageNumber);
      }
    } else if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Search Input Box */}
      <form onSubmit={handleFetch} className="relative bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-2 md:p-2.5 shadow-2xl shadow-black/60 transition-all duration-200 mb-4 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          <div className="relative flex-grow flex items-center min-w-0">
            <span className="absolute left-4 text-slate-400 font-bold select-none">@</span>
            <input 
              type="text" 
              placeholder="TikTok username (e.g. khaby.lame)" 
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl py-3.5 pl-10 pr-4 text-base md:text-lg transition-all duration-200 placeholder:text-slate-500 outline-none" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              disabled={loading} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 text-base md:text-lg font-bold whitespace-nowrap disabled:opacity-60 transition-transform active:scale-[0.98] cursor-pointer shrink-0"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Fetching...</span>
              </div>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Fetch Profile</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Trust Micro Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium mb-6">
        <span className="inline-flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-400" /> Public Profile Batch Fetch
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> One-Click Downloads
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No Login Required
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-xl mb-6 max-w-3xl mx-auto shadow-md text-sm text-red-300 space-y-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <p className="font-medium">{error}</p>
          </div>
          {(error.includes('Music/Audio') || error.includes('music')) && (
            <div className="pt-2 border-t border-red-800/40 flex items-center justify-between">
              <span className="text-xs text-red-200">Looking to download MP3 sound tracks?</span>
              <a
                href="/audio-extractor"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow"
              >
                Go to Audio Extractor &rarr;
              </a>
            </div>
          )}
        </div>
      )}

      {/* Profile & Video Results */}
      {result && (
        <div className="space-y-8">
          {result.userInfo && (
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
              <img 
                src={result.userInfo.user?.avatarLarger || result.userInfo.user?.avatar} 
                alt="avatar" 
                className="w-20 h-20 rounded-full border-2 border-indigo-500/40 object-cover shadow-md" 
                onError={e => (e.currentTarget.src = 'https://placehold.co/100')} 
              />
              <div className="text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">@{result.userInfo.user?.uniqueId || result.userInfo.user?.unique_id}</h2>
                <p className="text-slate-400 font-medium text-sm">{result.userInfo.user?.nickname}</p>
                <div className="flex justify-center sm:justify-start gap-5 mt-2.5 text-xs sm:text-sm text-slate-400">
                  <span><span className="text-white font-bold">{result.userInfo.stats?.videoCount || result.videos?.length || 0}</span> Videos</span>
                  <span><span className="text-white font-bold">{(result.userInfo.stats?.followerCount || 0).toLocaleString()}</span> Followers</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-bold text-white">Showing {currentVideos.length} of {videos.length} Videos</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {currentVideos.map((video: any) => (
                <motion.div 
                  key={video.video_id || video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900/80 rounded-xl overflow-hidden group relative border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 shadow-md"
                >
                  <div className="relative aspect-[9/16] bg-slate-950">
                    <img src={video.cover} alt={video.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <p className="text-white text-xs line-clamp-2 mb-2.5 font-semibold">{video.title || 'TikTok Video'}</p>
                      <a href={video.play} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg py-2.5 transition-all shadow-md active:scale-95 cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> Download MP4
                      </a>
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px] font-bold text-white">
                      <Play className="w-2.5 h-2.5" />
                      <span>{video.duration || 0}s</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {(totalPages > 1 || result.hasMore) && (
            <div className="flex items-center justify-center gap-2 mt-8 py-4">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loadingMore}
                className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {result.hasMore && (
                <button
                  onClick={() => handlePageChange(totalPages + 1)}
                  disabled={loadingMore}
                  className="px-3.5 h-9 rounded-xl border border-dashed border-indigo-500/40 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 text-xs font-bold transition-all"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              )}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={(currentPage === totalPages && !result.hasMore) || loadingMore}
                className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
