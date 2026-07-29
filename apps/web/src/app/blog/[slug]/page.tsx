'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';
import { getBlogPost } from '@/lib/api';
import Link from 'next/link';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getBlogPost(params.slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-20">
      <div className="glass-panel rounded-2xl p-8 animate-pulse space-y-4">
        <div className="h-8 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-1/4" />
        <div className="h-64 bg-white/5 rounded" />
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-3 bg-white/5 rounded" />)}</div>
      </div>
    </main>
  );

  if (notFound) return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-center">
      <BookOpen className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
      <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
      <Link href="/blog" className="text-primary-400 hover:underline">← Back to Blog</Link>
    </main>
  );

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <article className="glass-panel rounded-2xl overflow-hidden">
          {post.featuredImage && (
            <img src={post.featuredImage.url} alt={post.title} className="w-full h-80 object-cover" />
          )}
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />@{post.author?.username}</span>
              {post.categories?.map((c: any) => (
                <span key={c.id} className="px-2.5 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-full text-xs">{c.name}</span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{post.title}</h1>
            {post.summary && <p className="text-text-secondary text-lg mb-8 border-l-4 border-primary-500/40 pl-4 italic">{post.summary}</p>}

            <div className="prose prose-invert prose-lg max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
                {post.tags.map((tag: any) => (
                  <span key={tag.id} className="px-3 py-1 bg-white/5 border border-white/10 text-text-secondary rounded-full text-sm">#{tag.name}</span>
                ))}
              </div>
            )}
          </div>
        </article>
      </motion.div>
    </main>
  );
}
