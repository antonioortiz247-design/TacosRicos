'use client';

import { useCallback, useEffect, useState } from 'react';

type LiveData = {
  salesToday: number;
  ordersToday: number;
  avgTicket: number;
};

export function AdminLiveQueriesPanel({ negocio }: { negocio?: string }) {
  const [data, setData] = useState<LiveData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const query = negocio ? `?negocio=${encodeURIComponent(negocio)}` : '';
      const response = await fetch(`/api/admin/live-queries${query}`, { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error ? JSON.stringify(payload.error) : 'No se pudo cargar métricas en vivo.');
      }

      setData({
        salesToday: payload.salesToday,
        ordersToday: payload.ordersToday,
        avgTicket: payload.avgTicket
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  }, [negocio]);

  useEffect(() => {
    void load();
    const intervalId = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(intervalId);
  }, [load]);

  return (
    <section className="surface-card p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Métricas en vivo</h2>
        <button onClick={() => void load()} className="secondary-btn px-3 py-2 text-xs">
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      {data ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/60 bg-white/60 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <p className="text-xs text-ink-500 dark:text-ink-300">Ventas hoy</p>
            <p className="mt-1 font-display text-lg font-bold text-ink-900 dark:text-ink-50">${data.salesToday}</p>
          </article>
          <article className="rounded-2xl border border-white/60 bg-white/60 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <p className="text-xs text-ink-500 dark:text-ink-300">Pedidos hoy</p>
            <p className="mt-1 font-display text-lg font-bold text-ink-900 dark:text-ink-50">{data.ordersToday}</p>
          </article>
          <article className="rounded-2xl border border-white/60 bg-white/60 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <p className="text-xs text-ink-500 dark:text-ink-300">Ticket promedio</p>
            <p className="mt-1 font-display text-lg font-bold text-ink-900 dark:text-ink-50">${data.avgTicket}</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}
