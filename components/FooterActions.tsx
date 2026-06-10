'use client';

import Link from 'next/link';
import { LayoutDashboard, QrCode } from 'lucide-react';

export function FooterActions({ dashboardHref = '/admin/login' }: { dashboardHref?: string }) {
  return (
    <footer className="mt-8 border-t border-white/60 bg-white/50 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/50">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">tu restaurante app</p>
            <span className="pill">
              <QrCode size={12} className="text-brand-600 dark:text-brand-500" />
              QR
            </span>
          </div>
          <Link href={dashboardHref} className="secondary-btn w-full sm:w-auto">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
