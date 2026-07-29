'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { getBlogPosts } from '@/lib/api';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 text-primary-400 text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" /> Blog & Guides
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 heading-gradient">TikTok Tips & Guides</h1>
        <p className="text-text-secondary text-lg">Tutorials, tips, and news about TikTok and our tools.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-white/5" />
              <div className="p-5 space-y-3"><div className="h-4 bg-white/10 rounded w-3/4" /><div className="h-3 bg-white/5 rounded w-full" /></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel p-20 rounded-2xl text-center">
          <BookOpen className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Posts Yet</h3>
          <p className="text-text-secondary">Blog posts will appear here once published from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/blog/${post.slug}`}>
                <article className="glass-panel rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all hover:shadow-lg hover:shadow-primary-500/10 h-full flex flex-col">
                  {post.featuredImage && (
                    <img src={post.featuredImage.url} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  {!post.featuredImage && (
                    <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/10 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary-400/40" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />@{post.author?.username}</span>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h2>
                    {post.summary && <p className="text-text-secondary text-sm line-clamp-3 flex-1">{post.summary}</p>}
                    <div className="flex items-center gap-2 mt-4 text-primary-400 text-sm font-medium">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
