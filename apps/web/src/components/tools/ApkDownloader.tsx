'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Shield, Star, CheckCircle2 } from 'lucide-react';
import { getLatestApk } from '@/lib/api';

export default function ApkDownloader() {
  const [apk, setApk] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestApk().then(setApk).catch(() => setApk(null)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  }

  if (!apk) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-xl mx-auto my-6">
        <Smartphone className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">App Coming Soon</h3>
        <p className="text-text-secondary">We're working on our Android app. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 md:p-12 rounded-2xl flex flex-col md:flex-row gap-10 items-center mb-6 shadow-xl">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-2xl">
          <Smartphone className="w-16 h-16 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-white">{apk.title}</h2>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-sm rounded-full font-bold">v{apk.version}</span>
          </div>
          {apk.description && <p className="text-text-secondary mb-4 font-medium">{apk.description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-6 font-medium">
            {apk.fileSize && <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> {apk.fileSize}</span>}
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-blue-400" /> Verified & Safe</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400" /> Latest Release</span>
          </div>
          <a href={apk.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 btn-primary rounded-xl px-8 py-4 text-lg font-bold shadow-lg hover:scale-105 transition-all">
            <Download className="w-6 h-6" /> Download APK
          </a>
        </div>
      </motion.div>

      {apk.changelog && (
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">What's New in v{apk.version}</h3>
          <pre className="text-text-secondary text-sm whitespace-pre-wrap font-sans leading-relaxed">{apk.changelog}</pre>
        </div>
      )}
    </div>
  );
}
