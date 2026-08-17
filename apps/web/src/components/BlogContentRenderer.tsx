'use client';

import React, { useMemo } from 'react';
import { convertMarkdownToHtml } from './admin/RichTextEditor';

interface BlogContentRendererProps {
  content: string;
}

// Sanitize HTML string to prevent XSS attacks while preserving valid semantic styling and links
function sanitizeHtmlForPublicRender(rawHtml: string): string {
  if (!rawHtml) return '';

  // 1. Remove dangerous script and iframe elements
  let cleaned = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Remove inline javascript handlers (onclick, onerror, onload, etc.)
  cleaned = cleaned.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript: URIs in href or src
  cleaned = cleaned.replace(/href\s*=\s*['"]javascript:[^'"]*['"]/gi, 'href="#"');
  cleaned = cleaned.replace(/src\s*=\s*['"]javascript:[^'"]*['"]/gi, 'src=""');

  // 4. Ensure external links have safe rel attributes
  cleaned = cleaned.replace(/<a\s+([^>]*href=["']https?:\/\/[^"']*["'][^>]*)>/gi, (match) => {
    if (!match.includes('target=')) {
      match = match.replace('<a ', '<a target="_blank" ');
    }
    if (!match.includes('rel=')) {
      match = match.replace('<a ', '<a rel="noopener noreferrer" ');
    }
    return match;
  });

  return cleaned;
}

export default function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Check if content already contains HTML tags (e.g. <p>, <h2>, <h3>, <a, <ul, <ol)
    const hasHtmlTags = /<\/?(p|h[1-6]|a|ul|ol|li|blockquote|pre|code|table|div|span|strong|em|b|i)\b/i.test(content);

    let html = content;
    if (!hasHtmlTags) {
      // It's legacy plain text or raw Markdown -> Convert to rich semantic HTML
      html = convertMarkdownToHtml(content);
    }

    return sanitizeHtmlForPublicRender(html);
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <div
      className="blog-content-body prose prose-invert prose-lg max-w-none text-text-secondary leading-relaxed
        prose-headings:text-white prose-headings:font-bold
        prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4 prose-h1:leading-tight
        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-white prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h2:leading-snug
        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-primary-300 prose-h3:leading-snug
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-base sm:prose-p:text-lg
        prose-strong:text-white prose-strong:font-semibold
        prose-em:text-slate-200
        prose-a:text-primary-400 prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary-500/40 hover:prose-a:text-primary-300 hover:prose-a:decoration-primary-400 prose-a:transition-colors
        prose-ul:list-disc prose-ul:my-5 prose-ul:pl-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:my-5 prose-ol:pl-6 prose-ol:space-y-2
        prose-li:text-slate-300 prose-li:leading-relaxed
        prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-500/5 prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-slate-200
        prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-pre:rounded-2xl prose-pre:my-6 prose-pre:overflow-x-auto
        prose-code:text-emerald-400 prose-code:font-mono prose-code:text-sm
        prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:my-6 prose-img:shadow-xl
        prose-table:w-full prose-table:my-6 prose-table:border-collapse prose-table:border prose-table:border-white/10 prose-table:rounded-xl
        prose-th:border prose-th:border-white/10 prose-th:p-3 prose-th:bg-white/5 prose-th:text-white prose-th:font-semibold
        prose-td:border prose-td:border-white/10 prose-td:p-3 prose-td:text-slate-300
        prose-hr:border-white/10 prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
