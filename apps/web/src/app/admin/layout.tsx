'use client';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, Package, Mail, Home, Layout, Loader, Puzzle, Menu, X } from 'lucide-react';
import { api } from '@/lib/api';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/pages', label: 'Page Builder', icon: Layout },
  { href: '/admin/plugins', label: 'Plugins & Hooks', icon: Puzzle },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/contact', label: 'Contact Inbox', icon: Mail },
  { href: '/admin/apk', label: 'APK Manager', icon: Package },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }
    
    const hasLocalSession =
      typeof window !== 'undefined' &&
      (localStorage.getItem('admin_session') === 'true' || document.cookie.includes('admin_session=true'));

    if (hasLocalSession) {
      setCheckingAuth(false);
      return;
    }

    api.get('/auth/me')
      .then(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session', 'true');
        }
        setCheckingAuth(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session');
      document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/admin/login');
  };

  // Close sidebar on navigation change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] gap-3">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-text-secondary text-sm font-semibold">Verifying admin session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#030712]">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
        />
      )}

      {/* Sidebar - Collapsible on Mobile, Static on Large Screens */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-white/5 flex flex-col bg-[#030712]/95 backdrop-blur-xl shrink-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:bg-[#030712]/50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-text-secondary" />
              <span className="text-xs text-text-secondary hover:text-white transition-colors">Back to Site</span>
            </Link>
            <h2 className="text-lg font-bold heading-gradient mt-3">TikSavePro</h2>
            <p className="text-xs text-text-secondary">Admin Panel</p>
          </div>
          {/* Close button on Mobile */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-text-secondary hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-accent-500 hover:bg-accent-500/10 transition-colors cursor-pointer text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black text-white text-lg tracking-tight">TikSavePro Admin</span>
          <div className="w-10" /> {/* Balancer */}
        </header>

        {/* Scrollable body content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

