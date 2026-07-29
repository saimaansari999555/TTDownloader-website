'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const mockMedia = [
  { id: 1, name: 'hero-banner.jpg', type: 'image/jpeg', size: '1.2 MB', date: '2023-10-14' },
  { id: 2, name: 'logo-dark.png', type: 'image/png', size: '45 KB', date: '2023-10-12' },
  { id: 3, name: 'tiktok-guide.mp4', type: 'video/mp4', size: '14.5 MB', date: '2023-10-10' },
  { id: 4, name: 'author-avatar.jpg', type: 'image/jpeg', size: '230 KB', date: '2023-10-09' },
  { id: 5, name: 'seo-preview.webp', type: 'image/webp', size: '89 KB', date: '2023-10-08' },
];

export default function AdminMedia() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-text-secondary">Upload and manage all your assets.</p>
        </div>
        <button 
          onClick={() => setIsUploading(!isUploading)}
          className="btn-primary rounded-xl px-6 py-3 flex items-center gap-2"
        >
          <UploadCloud className="w-5 h-5" />
          Upload Files
        </button>
      </div>

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-8 rounded-2xl border-dashed border-2 border-primary-500/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Drag & Drop files here</h3>
          <p className="text-text-secondary mb-4">or click to browse from your computer</p>
          <p className="text-xs text-text-secondary">Supports JPG, PNG, WEBP, MP4 up to 50MB</p>
        </motion.div>
      )}

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search media..."
              className="w-full glass-input rounded-xl py-2 pl-10 pr-4"
            />
          </div>
          <button className="px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/5 text-text-secondary transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockMedia.map((file) => (
            <div key={file.id} className="group relative rounded-xl border border-white/5 bg-white/5 overflow-hidden hover:border-primary-500/30 transition-all">
              <div className="aspect-square bg-black/20 flex items-center justify-center p-4">
                {file.type.includes('image') ? (
                  <ImageIcon className="w-12 h-12 text-text-secondary opacity-50" />
                ) : (
                  <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white">MP4</div>
                )}
              </div>
              
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-text-secondary">{file.size}</p>
                  <p className="text-xs text-text-secondary">{file.date}</p>
                </div>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-1.5 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors shadow-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
