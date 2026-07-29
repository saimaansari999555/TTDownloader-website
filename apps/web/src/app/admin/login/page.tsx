'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { adminLogin } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await adminLogin(emailOrUsername, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500/10 blur-[100px] -z-10 mix-blend-screen pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-panel p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-text-secondary">Sign in to manage TTDownloader CMS.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-accent-400 bg-accent-500/10 px-4 py-3 rounded-xl border border-accent-500/20 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input type="text" required value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} className="w-full glass-input rounded-xl py-3 pl-12 pr-4" placeholder="admin or admin@site.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full glass-input rounded-xl py-3 pl-12 pr-4" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold disabled:opacity-70">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight className="w-4 h-4" />Sign In</>}
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-6">
          Default: <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary-400">superadmin</code> / <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary-400">SuperAdmin@123!</code>
        </p>
      </motion.div>
    </div>
  );
}
