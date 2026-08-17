'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  RemoveFormatting,
  Eye,
  Code2,
  ExternalLink,
  Check,
  X
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Markdown to HTML conversion helper
export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  let html = markdown;

  // Code blocks ```code```
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, (_m, code) => `<code>${escapeHtml(code)}</code>`);

  // Headings (# H1, ## H2, ### H3)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes (> text)
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.*?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${target}>${text}</a>`;
  });

  // Ordered list lines (1. text)
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<oli>$1</oli>');
  html = html.replace(/(<oli>[\s\S]*?<\/oli>(\s*<oli>[\s\S]*?<\/oli>)*)/g, (match) => {
    return `<ol>${match.replace(/<\/?oli>/g, (t) => (t === '<oli>' ? '<li>' : '</li>'))}</ol>`;
  });

  // Unordered list lines (- text or * text)
  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<uli>$1</uli>');
  html = html.replace(/(<uli>[\s\S]*?<\/uli>(\s*<uli>[\s\S]*?<\/uli>)*)/g, (match) => {
    return `<ul>${match.replace(/<\/?uli>/g, (t) => (t === '<uli>' ? '<li>' : '</li>'))}</ul>`;
  });

  // Split double line breaks into paragraphs
  const blocks = html.split(/\n\s*\n/);
  html = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return '';
      if (/^<(h[1-6]|ul|ol|blockquote|pre|table|p)/i.test(block)) {
        return block;
      }
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize & normalize HTML pasted from ChatGPT / Google Docs
function sanitizePastedHtml(htmlString: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Remove scripts, styles, iframes, and meta
    const dangerous = doc.querySelectorAll('script, style, iframe, meta, object, embed, link');
    dangerous.forEach((el) => el.remove());

    function cleanNode(node: Node): Node | null {
      if (node.nodeType === Node.TEXT_NODE) {
        return node;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }

      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Convert ChatGPT / Word wrappers into semantic tags
      const allowedTags = [
        'h1', 'h2', 'h3', 'h4', 'p', 'strong', 'b', 'em', 'i', 'u', 's',
        'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead',
        'tbody', 'tr', 'th', 'td', 'br', 'hr', 'img'
      ];

      // If it's a generic div or span, check if it should become a paragraph or keep its children
      if (!allowedTags.includes(tagName)) {
        const fragment = doc.createDocumentFragment();
        Array.from(el.childNodes).forEach((child) => {
          const cleaned = cleanNode(child);
          if (cleaned) fragment.appendChild(cleaned);
        });
        return fragment;
      }

      // Clean attributes
      const newEl = doc.createElement(tagName);
      if (tagName === 'a') {
        const href = el.getAttribute('href') || '#';
        newEl.setAttribute('href', href);
        const target = el.getAttribute('target');
        if (target) newEl.setAttribute('target', target);
        const rel = el.getAttribute('rel');
        if (rel) newEl.setAttribute('rel', rel);
        else if (href.startsWith('http')) newEl.setAttribute('rel', 'noopener noreferrer');
      } else if (tagName === 'img') {
        const src = el.getAttribute('src');
        if (src) newEl.setAttribute('src', src);
        const alt = el.getAttribute('alt') || '';
        newEl.setAttribute('alt', alt);
      } else if (tagName === 'code') {
        const className = el.getAttribute('class');
        if (className && className.startsWith('language-')) {
          newEl.setAttribute('class', className);
        }
      }

      Array.from(el.childNodes).forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) newEl.appendChild(cleaned);
      });

      return newEl;
    }

    const cleanFrag = doc.createDocumentFragment();
    Array.from(doc.body.childNodes).forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) cleanFrag.appendChild(cleaned);
    });

    const container = doc.createElement('div');
    container.appendChild(cleanFrag);
    return container.innerHTML;
  } catch (e) {
    return htmlString;
  }
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write or paste your article here...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [sourceCode, setSourceCode] = useState<string>(value || '');
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  // Link Dialog Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [linkNofollow, setLinkNofollow] = useState(false);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Sync internal editor content with incoming value
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setSourceCode(value || '');
  }, [value, mode]);

  const updateActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
      updateActiveFormats();
    }
  };

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (mode === 'code') return;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  const applyHeading = (level: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote' | 'pre') => {
    if (mode === 'code') return;
    if (editorRef.current) {
      editorRef.current.focus();
      if (level === 'p') {
        document.execCommand('formatBlock', false, '<p>');
      } else if (level === 'blockquote') {
        document.execCommand('formatBlock', false, '<blockquote>');
      } else if (level === 'pre') {
        document.execCommand('formatBlock', false, '<pre>');
      } else {
        document.execCommand('formatBlock', false, `<${level}>`);
      }
      handleInput();
    }
  };

  // Link Insertion
  const openLinkModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
      setLinkText(range.toString() || '');
    } else {
      setSavedRange(null);
      setLinkText('');
    }
    setLinkUrl('');
    setLinkNewTab(true);
    setLinkNofollow(false);
    setShowLinkModal(true);
  };

  const saveLink = () => {
    if (!linkUrl) return;
    setShowLinkModal(false);

    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();

      if (savedRange && selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }

      const textToDisplay = linkText.trim() || linkUrl;
      const target = linkNewTab ? ' target="_blank"' : '';
      const relParts = [];
      if (linkNewTab) relParts.push('noopener', 'noreferrer');
      if (linkNofollow) relParts.push('nofollow');
      const rel = relParts.length > 0 ? ` rel="${relParts.join(' ')}"` : '';

      const linkHtml = `<a href="${linkUrl}"${target}${rel}>${escapeHtml(textToDisplay)}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
      handleInput();
    }
  };

  const removeLink = () => {
    exec('unlink');
  };

  // Smart Paste Interceptor for ChatGPT / Markdown / Rich HTML
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboard = e.clipboardData;
    const htmlData = clipboard.getData('text/html');
    const textData = clipboard.getData('text/plain');

    let processedHtml = '';

    // If pasted from ChatGPT / Google Docs rich HTML
    if (htmlData && htmlData.trim().length > 0) {
      processedHtml = sanitizePastedHtml(htmlData);
    } else if (textData) {
      // Check if plain text is markdown formatted (# Heading, **bold**, etc.)
      const isMarkdown = /(^#+\s|\*\*|_|\[.*\]\(.*\)|\n\s*[-*]\s|\n\s*\d+\.\s|```)/m.test(textData);
      if (isMarkdown) {
        processedHtml = convertMarkdownToHtml(textData);
      } else {
        // Convert multi-line plain text into clean paragraphs
        const paragraphs = textData.split(/\n\s*\n/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br />')}</p>`).join('');
        processedHtml = paragraphs || `<p>${escapeHtml(textData)}</p>`;
      }
    }

    if (processedHtml) {
      document.execCommand('insertHTML', false, processedHtml);
      handleInput();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        exec('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        exec('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        exec('underline');
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        openLinkModal();
      }
    }
  };

  return (
    <div className="border border-white/15 rounded-2xl overflow-hidden bg-slate-950/60 shadow-xl focus-within:border-primary-500/50 transition-all">
      {/* Toolbar */}
      <div className="p-2 border-b border-white/10 bg-white/[0.03] flex flex-wrap items-center justify-between gap-1">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => exec('undo')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('redo')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-1" />

          {/* Heading Selectors */}
          <button
            type="button"
            onClick={() => applyHeading('h1')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-text-secondary hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4 text-primary-400" />
            <span className="hidden sm:inline">H1</span>
          </button>

          <button
            type="button"
            onClick={() => applyHeading('h2')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-text-secondary hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Heading 2 (Main Section)"
          >
            <Heading2 className="w-4 h-4 text-accent-400" />
            <span className="hidden sm:inline">H2</span>
          </button>

          <button
            type="button"
            onClick={() => applyHeading('h3')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-text-secondary hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Heading 3 (Subsection)"
          >
            <Heading3 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">H3</span>
          </button>

          <button
            type="button"
            onClick={() => applyHeading('p')}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Normal Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-1" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => exec('bold')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.bold ? 'bg-primary-500/30 text-primary-300' : 'text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('italic')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.italic ? 'bg-primary-500/30 text-primary-300' : 'text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('underline')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.underline ? 'bg-primary-500/30 text-primary-300' : 'text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('strikeThrough')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.strikeThrough ? 'bg-primary-500/30 text-primary-300' : 'text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-1" />

          {/* Link Controls */}
          <button
            type="button"
            onClick={openLinkModal}
            className="p-1.5 rounded-lg text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 transition-colors"
            title="Insert Link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={removeLink}
            className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-white/10 transition-colors"
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => exec('insertUnorderedList')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.insertUnorderedList ? 'bg-primary-500/30 text-primary-300' : 'text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('insertOrderedList')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.insertOrderedList ? 'bg-primary-500/30 text-primary-300' : 'text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Blockquote & Code */}
          <button
            type="button"
            onClick={() => applyHeading('blockquote')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => applyHeading('pre')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('removeFormat')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-yellow-400 hover:bg-white/10 transition-colors"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle: Visual vs HTML Source */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              if (mode === 'code') {
                onChange(sourceCode);
              }
              setMode('visual');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'visual' ? 'bg-primary-500 text-white shadow-md' : 'text-text-secondary hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Visual
          </button>
          <button
            type="button"
            onClick={() => {
              if (mode === 'visual' && editorRef.current) {
                setSourceCode(editorRef.current.innerHTML);
              }
              setMode('code');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'code' ? 'bg-primary-500 text-white shadow-md' : 'text-text-secondary hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> HTML / Source
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className="min-h-[360px] max-h-[600px] overflow-y-auto p-5 text-white outline-none prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-primary-400 prose-a:underline hover:prose-a:text-primary-300 prose-blockquote:border-l-4 prose-blockquote:border-primary-500/60 prose-blockquote:pl-4 prose-blockquote:italic prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-ul:list-disc prose-ol:list-decimal"
          data-placeholder={placeholder}
        />
      ) : (
        <textarea
          rows={15}
          value={sourceCode}
          onChange={(e) => {
            setSourceCode(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full min-h-[360px] p-5 bg-transparent font-mono text-sm text-emerald-400 outline-none resize-y"
          placeholder="Paste or write raw HTML / Markdown here..."
        />
      )}

      {/* Link Insertion Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary-400" /> Insert Hyperlink
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-text-secondary hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Display Text</label>
                <input
                  type="text"
                  placeholder="e.g. TikTok Video Downloader for PC"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full glass-input rounded-xl py-2.5 px-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">URL / Link Target *</label>
                <input
                  type="url"
                  placeholder="https://tik-tokdownloader.xyz/video or /blog/my-post"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full glass-input rounded-xl py-2.5 px-3 text-sm text-white font-mono"
                  autoFocus
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary hover:text-white">
                  <input
                    type="checkbox"
                    checked={linkNewTab}
                    onChange={(e) => setLinkNewTab(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-0"
                  />
                  <span>Open link in new tab (<code className="text-primary-400">target="_blank"</code>)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary hover:text-white">
                  <input
                    type="checkbox"
                    checked={linkNofollow}
                    onChange={(e) => setLinkNofollow(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-0"
                  />
                  <span>Add <code className="text-accent-400">rel="nofollow"</code> (for sponsored/affiliate links)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLink}
                disabled={!linkUrl.trim()}
                className="btn-primary rounded-xl px-5 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" /> Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
