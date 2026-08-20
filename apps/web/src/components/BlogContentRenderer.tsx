'use client';

import React, { useMemo } from 'react';

interface BlogContentRendererProps {
  content: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Multi-pass comprehensive Markdown & Rich HTML Normalizer
export function normalizeBlogContent(rawContent: string): string {
  if (!rawContent) return '';

  let html = rawContent.trim();

  // 1. Un-wrap markdown tokens that got trapped inside paragraph wrappers
  // e.g. <p>### Heading</p> or <p>## Heading</p> or <p># Heading</p>
  html = html.replace(/<p>\s*###\s+(.*?)<\/p>/gi, '<h3>$1</h3>');
  html = html.replace(/<p>\s*##\s+(.*?)<\/p>/gi, '<h2>$1</h2>');
  html = html.replace(/<p>\s*#\s+(.*?)<\/p>/gi, '<h2>$1</h2>');
  html = html.replace(/<p>\s*&gt;\s+(.*?)<\/p>/gi, '<blockquote>$1</blockquote>');
  html = html.replace(/<p>\s*>\s+(.*?)<\/p>/gi, '<blockquote>$1</blockquote>');

  // 2. Demote any <h1> inside article body to <h2> so there is strictly ONE <h1> per page (the post title)
  html = html.replace(/<h1(\s*[^>]*)>(.*?)<\/h1>/gi, '<h2$1>$2</h2>');

  // 3. Raw markdown headings (# H1, ## H2, ### H3, #### H4)
  html = html.replace(/^####\s+(.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*$)/gim, '<h2>$1</h2>');

  // 4. Blockquotes (> text)
  html = html.replace(/^>\s+(.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^&gt;\s+(.*$)/gim, '<blockquote>$1</blockquote>');

  // 5. Code blocks (```lang ... ```)
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_m, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // 6. Inline code (`code`)
  html = html.replace(/`([^`\n]+)`/g, (_m, code) => `<code>${escapeHtml(code)}</code>`);

  // 7. Markdown Links: [Anchor Text](URL) -> <a href="URL">Anchor Text</a>
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/gi, (_m, anchorText, url) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${target}>${anchorText}</a>`;
  });

  // 8. Bold & Italic markdown tokens
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // 9. Markdown Ordered Lists (1. text, 2. text)
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<oli>$1</oli>');
  html = html.replace(/(<oli>[\s\S]*?<\/oli>(\s*<oli>[\s\S]*?<\/oli>)*)/gi, (match) => {
    const items = match.replace(/<\/?oli>/gi, (t) => (t.toLowerCase() === '<oli>' ? '<li>' : '</li>'));
    return `<ol>${items}</ol>`;
  });

  // 10. Markdown Unordered Lists (- text, * text, + text)
  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<uli>$1</uli>');
  html = html.replace(/(<uli>[\s\S]*?<\/uli>(\s*<uli>[\s\S]*?<\/uli>)*)/gi, (match) => {
    const items = match.replace(/<\/?uli>/gi, (t) => (t.toLowerCase() === '<uli>' ? '<li>' : '</li>'));
    return `<ul>${items}</ul>`;
  });

  // 11. Format paragraphs if content is raw blocks without HTML tags
  const hasBlockTags = /<(h[1-6]|ul|ol|blockquote|pre|table|p|div|section)/i.test(html);
  if (!hasBlockTags) {
    const blocks = html.split(/\n\s*\n/);
    html = blocks
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^<(h[1-6]|ul|ol|blockquote|pre|table)/i.test(trimmed)) {
          return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .filter(Boolean)
      .join('\n');
  }

  // 12. Clean up any empty <p></p> or accidental paragraph nesting around block elements
  html = html.replace(/<p>\s*<(h[1-6]|ul|ol|blockquote|pre|table)([\s\S]*?)<\/\1>\s*<\/p>/gi, '<$1$2</$1>');

  return html;
}

// Sanitize HTML string to prevent XSS attacks while preserving valid semantic styling and links
function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  // 1. Remove dangerous executable elements
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
    const normalized = normalizeBlogContent(content);
    return sanitizeHtml(normalized);
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <div
      className="blog-content-body"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
