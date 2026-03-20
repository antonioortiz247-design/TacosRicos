'use client';

import Link from 'next/link';

type HeaderProps = {
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  eventHref?: string;
  dashboardHref?: string;
};

export function Header({ title, subtitle, isOpen = true, eventHref, dashboardHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-warm-100 bg-white/95 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-warm-700 dark:text-warm-100">{title}</h1>
          {subtitle ? <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {isOpen ? 'Abierto' : 'Cerrado'}
          </span>
          {eventHref ? (
            <Link href={eventHref} className="rounded-lg border border-warm-300 px-3 py-1 text-xs font-semibold text-warm-700">
              Reservar evento 🎉
            </Link>
          ) : null}
          {dashboardHref ? (
            <Link href={dashboardHref} className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-warm-500">
              Dashboard dueño
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
