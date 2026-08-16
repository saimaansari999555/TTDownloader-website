import Link from 'next/link';
import { Download, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Tik<span className="text-primary-400">SavePro</span></span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              TikSavePro provides simple browser-based tools for downloading and working with publicly available TikTok content.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold mb-4">Download Tools</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'TikTok Downloader' },
                { href: '/video', label: 'Video Downloader' },
                { href: '/audio', label: 'Audio Extractor' },
                { href: '/bulk', label: 'Bulk Downloader' },
                { href: '/apk', label: 'Android APK' },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-text-secondary hover:text-primary-400 text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact-us', label: 'Contact Us' },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-text-secondary hover:text-primary-400 text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/dmca', label: 'DMCA' },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-text-secondary hover:text-primary-400 text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">© 2026 TikSavePro. For educational purposes only. Not affiliated with TikTok.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@tik-tokdownloader.xyz" className="text-text-secondary hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="#" className="text-text-secondary hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
