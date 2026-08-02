'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Search, Filter, Copy, Check, Link as LinkIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultSamples = [
  { id: 'sample-1', name: 'tiktok-banner.webp', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80', type: 'image/jpeg', size: '1.2 MB', date: new Date().toISOString().split('T')[0] },
  { id: 'sample-2', name: 'video-downloader-preview.webp', url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80', type: 'image/jpeg', size: '450 KB', date: new Date().toISOString().split('T')[0] },
  { id: 'sample-3', name: 'mobile-app-bg.webp', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80', type: 'image/jpeg', size: '890 KB', date: new Date().toISOString().split('T')[0] },
];

export default function AdminMedia() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('uploaded_media_assets') : null;
    if (saved) {
      try {
        setMediaList(JSON.parse(saved));
      } catch (e) {
        setMediaList(defaultSamples);
      }
    } else {
      setMediaList(defaultSamples);
      if (typeof window !== 'undefined') {
        localStorage.setItem('uploaded_media_assets', JSON.stringify(defaultSamples));
      }
    }
  }, []);

  const saveMediaList = (newList: any[]) => {
    setMediaList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uploaded_media_assets', JSON.stringify(newList));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        const newAsset = {
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          url: resultUrl,
          type: file.type || 'image/png',
          size: formatFileSize(file.size),
          date: new Date().toISOString().split('T')[0],
        };
        setMediaList((prev) => {
          const updated = [newAsset, ...prev];
          if (typeof window !== 'undefined') {
            localStorage.setItem('uploaded_media_assets', JSON.stringify(updated));
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddExternalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    const newAsset = {
      id: 'media-url-' + Date.now(),
      name: customUrlInput.split('/').pop()?.split('?')[0] || 'external-image.jpg',
      url: customUrlInput.trim(),
      type: 'image/jpeg',
      size: 'External',
      date: new Date().toISOString().split('T')[0],
    };

    saveMediaList([newAsset, ...mediaList]);
    setCustomUrlInput('');
    setShowAddUrlModal(false);
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    const updated = mediaList.filter((item) => item.id !== id);
    saveMediaList(updated);
  };

  const filteredList = mediaList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-text-secondary">Upload images from your computer or save image URLs for blog posts.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddUrlModal(!showAddUrlModal)}
            className="px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <LinkIcon className="w-4 h-4 text-primary-400" />
            Add Image URL
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary rounded-xl px-6 py-3 flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary-500/20"
          >
            <UploadCloud className="w-5 h-5" />
            Upload File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFilesSelected(e.target.files)}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
        </div>
      </div>

      {/* External URL Modal */}
      {showAddUrlModal && (
        <form onSubmit={handleAddExternalUrl} className="glass-panel p-6 rounded-2xl space-y-4 border border-primary-500/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary-400" /> Save External Image Link
          </h3>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Image URL</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/... or any image link"
              className="w-full glass-input rounded-xl py-3 px-4 text-sm"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddUrlModal(false)}
              className="px-4 py-2 rounded-xl text-text-secondary hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary rounded-xl px-5 py-2 text-sm font-bold">
              Save to Library
            </button>
          </div>
        </form>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesSelected(e.dataTransfer.files);
        }}
        className="glass-panel p-8 rounded-2xl border-dashed border-2 border-primary-500/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 hover:border-primary-500/60 transition-all group"
      >
        <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8 text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Click to select or Drag & Drop images here</h3>
        <p className="text-text-secondary text-sm mb-3">Upload JPG, PNG, WEBP files from your phone or computer</p>
        <span className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-xs font-semibold">
          Auto-generates instant Image URLs for Blog Posts
        </span>
      </div>

      {/* Media Grid */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search images by name..."
              className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-xs text-text-secondary font-medium">{filteredList.length} assets available</p>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <ImageIcon className="w-12 h-12 opacity-30 mx-auto mb-3" />
            <p>No media files found. Upload images to generate URLs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredList.map((file) => (
              <div
                key={file.id}
                className="group relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-primary-500/40 transition-all flex flex-col justify-between"
              >
                {/* Image Preview Container */}
                <div className="aspect-[4/3] bg-black/40 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info & Copy URL Action */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex justify-between items-center mt-1 text-xs text-text-secondary">
                      <span>{file.size}</span>
                      <span>{file.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(file.url, file.id)}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-md ${
                      copiedId === file.id
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-500/15 hover:bg-primary-500/30 text-primary-400 border border-primary-500/30'
                    }`}
                  >
                    {copiedId === file.id ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        URL Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Image URL
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
