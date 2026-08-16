'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Download, Music, Users, Menu, X } from 'lucide-react';

const tools = [
  { href: '/video', label: 'Video Downloader', icon: Download },
  { href: '/audio', label: 'Audio Extractor', icon: Music },
  { href: '/bulk', label: 'Bulk Downloader', icon: Users },
];

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/apk', label: 'Android APK' },
  { href: '/about', label: 'About' },
  { href: '/contact-us', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel rounded-none border-x-0 border-t-0 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Tik<span className="text-primary-400">SavePro</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname === tool.href;
              return (
                <Link key={tool.href} href={tool.href} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-primary-400 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {tool.label}
                </Link>
              );
            })}
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? 'text-primary-400 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-text-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 pb-2 space-y-1 border-t border-white/10 pt-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                  <Icon className="w-4 h-4 shrink-0" /> {tool.label}
                </Link>
              );
            })}
            <div className="h-[1px] bg-white/10 my-2" />
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
