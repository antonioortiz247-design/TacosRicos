'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Download, QrCode, ShieldCheck } from 'lucide-react';

type HeaderProps = {
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  eventHref?: string;
  variant?: 'customer' | 'admin';
  backHref?: string;
  navLinks?: Array<{ href: string; label: string }>;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const OPENING_MINUTE = 9 * 60 + 30; // 09:30
const CLOSING_MINUTE = 15 * 60; // 15:00

function isWithinOrderSchedule(date: Date): boolean {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= OPENING_MINUTE && minutes <= CLOSING_MINUTE;
}

export function Header({ title, subtitle, isOpen, eventHref, variant = 'customer', backHref, navLinks }: HeaderProps) {
  const pathname = usePathname();
  // Forzado a true para pruebas fuera de horario
  const openNow = useMemo(() => (typeof isOpen === 'boolean' ? isOpen : true), [isOpen]);
  const [logoError, setLogoError] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      window.alert('Para instalar la app abre el menú del navegador y selecciona "Agregar a pantalla de inicio".');
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/55 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/55">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {backHref ? (
            <Link href={backHref} className="secondary-btn px-3 py-2 text-xs sm:text-sm">
              <ChevronLeft size={16} />
              Volver
            </Link>
          ) : null}
          <Link href="/" className="transition-transform active:scale-95 hover:scale-105">
            {!logoError ? (
              <img
                src="/logotacosricos.png"
                alt="Logo Tu Restaurante"
                className="h-11 w-11 rounded-2xl border border-white/60 object-cover shadow-soft backdrop-blur dark:border-white/10"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/60 bg-white/70 text-sm font-bold text-ink-900 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-ink-50">
                tr
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold tracking-tight text-ink-900 sm:text-xl dark:text-ink-50">{title}</h1>
            {subtitle ? <p className="truncate text-sm text-ink-500 dark:text-ink-300">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {variant !== 'admin' ? (
            <span
              className={`pill ${
                openNow
                  ? 'bg-white/70 text-ink-700 dark:bg-white/10 dark:text-ink-200'
                  : 'bg-rose-100/70 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200'
              }`}
            >
              {openNow ? 'Abierto' : 'Cerrado'}
            </span>
          ) : null}
          {variant !== 'admin' ? (
            <button onClick={handleInstallClick} className="primary-btn px-4 py-2 text-xs sm:text-sm">
              <Download size={16} />
              Instalar
            </button>
          ) : null}
          {variant !== 'admin' && eventHref ? (
            <Link href={eventHref} className="secondary-btn px-4 py-2 text-xs sm:text-sm">
              <QrCode size={16} />
              Eventos
            </Link>
          ) : null}
          {variant === 'admin' ? (
            <span className="pill">
              <ShieldCheck size={12} className="text-accent-600 dark:text-accent-500" />
              admin
            </span>
          ) : null}
        </div>
      </div>

      {variant === 'admin' && navLinks && navLinks.length > 0 ? (
        <nav className="mx-auto mt-3 w-full max-w-6xl overflow-x-auto pb-1" aria-label="Navegación admin">
          <div className="flex w-max min-w-full gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold tracking-wide transition ${
                    isActive
                      ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft'
                      : 'bg-white/60 text-ink-900 hover:bg-white/80 dark:bg-white/10 dark:text-ink-50 dark:hover:bg-white/15'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
