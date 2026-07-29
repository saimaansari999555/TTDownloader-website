'use client';
import { useEffect, useState } from 'react';
import { Activity, Download, Users, FileText, Mail, Package } from 'lucide-react';
import { getSettings, getContactMessages, getAllApks } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [contactCount, setContactCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getContactMessages()
      .then(msgs => { setContactCount(msgs.length); setUnreadCount(msgs.filter((m: any) => !m.isRead).length); })
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Unread Messages', value: unreadCount.toString(), icon: Mail, color: 'text-accent-400', bg: 'bg-accent-500/10', href: '/admin/contact' },
    { label: 'Total Messages', value: contactCount.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', href: '/admin/contact' },
    { label: 'Blog Posts', value: '—', icon: FileText, color: 'text-green-400', bg: 'bg-green-500/10', href: '/admin/blog' },
    { label: 'Server Status', value: 'Online', icon: Activity, color: 'text-primary-400', bg: 'bg-primary-500/10', href: '#' },
  ];

  const quickLinks = [
    { href: '/admin/blog', label: 'Write New Post', icon: FileText, color: 'text-primary-400' },
    { href: '/admin/contact', label: 'View Messages', icon: Mail, color: 'text-accent-400' },
    { href: '/admin/apk', label: 'Manage APK', icon: Package, color: 'text-green-400' },
    { href: '/admin/settings', label: 'Site Settings', icon: Activity, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-text-secondary">Welcome back, Super Admin. Here's your CMS at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-colors">
              <div className={`p-4 rounded-xl ${stat.bg}`}><Icon className={`w-8 h-8 ${stat.color}`} /></div>
              <div><p className="text-text-secondary text-sm font-medium">{stat.label}</p><p className="text-2xl font-bold text-white mt-1">{stat.value}</p></div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link key={i} href={link.href} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                  <Icon className={`w-5 h-5 ${link.color}`} /><span className="text-white text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { label: 'API Server', status: 'Online', color: 'bg-green-500' },
              { label: 'Database (SQLite)', status: 'Connected', color: 'bg-green-500' },
              { label: 'Redis Cache', status: 'Using Memory', color: 'bg-yellow-500' },
              { label: 'tikwm.com API', status: 'Connected', color: 'bg-green-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-text-secondary text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                  <span className="text-white text-sm">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
