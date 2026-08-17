'use client';

import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import RedirectManager from '@/components/admin/RedirectManager';

export default function AdminRedirectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <ArrowLeftRight className="w-8 h-8 text-primary-400" /> Redirect Manager
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Create and manage server-side 301 Permanent and 302 Temporary URL redirects. Ensure zero 404 errors, preserve SEO domain authority, and seamlessly map slug updates.
        </p>
      </div>

      <RedirectManager />
    </div>
  );
}
