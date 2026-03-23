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
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {!logoError ? (
            <img
              src="/logotacosricos.png"
              alt="Logo Tacos Ricos"
              className="h-12 w-12 rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-700"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-amber-100 text-sm font-bold text-orange-700 dark:border-zinc-700 dark:bg-orange-500/15 dark:text-orange-200">
              TR
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">{title}</h1>
            {subtitle ? <p className="truncate text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className={`pill ${openNow ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>
            {openNow ? 'Abierto' : 'Cerrado'}
          </span>
          {eventHref ? (
            <Link href={eventHref} className="secondary-btn px-3 py-1.5 text-xs sm:text-sm">
              Reservar evento
            </Link>
          ) : null}
          {dashboardHref ? (
            <Link href={dashboardHref} className="primary-btn px-3 py-1.5 text-xs sm:text-sm">
              Dashboard dueño
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
