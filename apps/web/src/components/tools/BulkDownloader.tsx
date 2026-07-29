'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Download, AlertCircle, Play, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setResult(null); 
    setCursor(0);
    setCurrentPage(1);
    
    if (!username.trim()) { 
      setError('Please enter a TikTok username'); 
      return; 
    }
    setLoading(true);
    try {
      const data = await fetchUserVideos(username.trim());
      setResult(data);
      setCursor(data.cursor || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile. Check the username and try again.');
    } finally { 
      setLoading(false); 
    }
  };

  const loadMoreFromApi = async () => {
    if (!result || loadingMore || !result.hasMore) return false;
    setLoadingMore(true);
    try {
      const data = await fetchUserVideos(username.trim(), cursor);
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

  // Slicing logic for current page
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
      <form onSubmit={handleFetch} className="glass-panel p-2 md:p-3 flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto shadow-xl">
        <div className="relative flex-grow flex items-center">
          <span className="absolute left-4 text-text-secondary font-bold">@</span>
          <input 
            type="text" 
            placeholder="username (e.g. veggie.toons03)" 
            className="w-full glass-input rounded-xl py-4 pl-10 pr-4 text-lg" 
            value={username} 
            onChange={e => setUsername(e.target.value.replace('@', ''))} 
            disabled={loading} 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="btn-primary rounded-xl px-8 py-4 flex items-center justify-center gap-2 text-lg font-bold whitespace-nowrap disabled:opacity-70 transition-transform active:scale-95"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Search className="w-5 h-5" />Fetch Profile</>}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-accent-500 bg-accent-500/10 px-4 py-3.5 rounded-xl border border-accent-500/20 mb-6 max-w-3xl mx-auto shadow-md">
          <AlertCircle className="w-5 h-5 shrink-0" /><p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          {/* Profile header */}
          {result.userInfo && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-lg border border-white/10">
              <img 
                src={result.userInfo.user?.avatarLarger || result.userInfo.user?.avatar} 
                alt="avatar" 
                className="w-24 h-24 rounded-full border-4 border-primary-500/30 object-cover shadow-md" 
                onError={e => (e.currentTarget.src = 'https://placehold.co/100')} 
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-black text-white">@{result.userInfo.user?.uniqueId || result.userInfo.user?.unique_id}</h2>
                <p className="text-text-secondary font-medium">{result.userInfo.user?.nickname}</p>
                <div className="flex justify-center sm:justify-start gap-6 mt-3 text-sm text-text-secondary">
                  <span><span className="text-white font-bold">{result.userInfo.stats?.videoCount || result.videos?.length || 0}</span> Videos</span>
                  <span><span className="text-white font-bold">{(result.userInfo.stats?.followerCount || 0).toLocaleString()}</span> Followers</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Showing {currentVideos.length} of {videos.length} fetched videos</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {currentVideos.map((video: any) => (
                <motion.div 
                  key={video.video_id || video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-panel rounded-xl overflow-hidden group relative border border-white/5 bg-slate-900/50 hover:border-primary-500/30 transition-all duration-300"
                >
                  <div className="relative aspect-[9/16] bg-black/40">
                    <img src={video.cover} alt={video.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-xs line-clamp-3 mb-3 font-semibold">{video.title || 'TikTok Video'}</p>
                      <a href={video.play} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-lg py-2.5 transition-all shadow-md active:scale-95">
                        <Download className="w-3.5 h-3.5" /> Download MP4
                      </a>
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-white">
                      <Play className="w-2.5 h-2.5" />
                      <span>{video.duration || 0}s</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Page-by-Page Numbers Pagination */}
          {(totalPages > 1 || result.hasMore) && (
            <div className="flex items-center justify-center gap-2 mt-12 py-6">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loadingMore}
                className="p-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === pageNum ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'border border-white/10 text-text-secondary hover:text-white hover:bg-white/5'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {result.hasMore && (
                <button
                  onClick={() => handlePageChange(totalPages + 1)}
                  disabled={loadingMore}
                  className="px-4 h-10 rounded-xl border border-dashed border-primary-500/30 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 text-sm font-bold transition-all"
                >
                  {loadingMore ? 'Loading...' : 'Load Page ' + (totalPages + 1)}
                </button>
              )}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={(currentPage === totalPages && !result.hasMore) || loadingMore}
                className="p-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
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
