'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function FooterActions({ dashboardHref = '/admin/login' }: { dashboardHref?: string }) {
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
    <footer className="mt-6 border-t border-amber-200/80 bg-white/85 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row">
        <Link href={dashboardHref} className="secondary-btn w-full">
          Dashboard
        </Link>
        <button onClick={handleInstallClick} className="primary-btn w-full">
          Descargar App
        </button>
      </div>
    </footer>
  );
}
