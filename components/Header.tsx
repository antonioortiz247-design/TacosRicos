'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  eventHref?: string;
  dashboardHref?: string;
};

const OPENING_MINUTE = 9 * 60 + 30; // 09:30
const CLOSING_MINUTE = 15 * 60; // 15:00

function isWithinOrderSchedule(date: Date): boolean {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= OPENING_MINUTE && minutes <= CLOSING_MINUTE;
}

export function Header({ title, subtitle, isOpen, eventHref, dashboardHref }: HeaderProps) {
  const openNow = useMemo(() => (typeof isOpen === 'boolean' ? isOpen : isWithinOrderSchedule(new Date())), [isOpen]);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-warm-100 bg-white/95 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {!logoError ? (
            <img
              src="/logotacosricos.png"
              alt="Logo Tacos Ricos"
              className="h-11 w-11 rounded-full border border-warm-200 object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-full border border-warm-200 bg-warm-50 text-xs font-bold text-warm-700">
              TR
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-warm-700 dark:text-warm-100">{title}</h1>
            {subtitle ? <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${openNow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {openNow ? 'Abierto' : 'Cerrado'}
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
