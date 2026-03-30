'use client';

import Link from 'next/link';

export function FooterActions({ adminHref = '/admin/login' }: { adminHref?: string }) {
  return (
    <footer className="mt-6 border-t border-amber-200/80 bg-white/85 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto w-full max-w-6xl">
        <Link href={adminHref} className="secondary-btn w-full">
          Administración
        </Link>
      </div>
    </footer>
  );
}
