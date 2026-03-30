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
    <section className="rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Consultas SQL en vivo</h2>
        <button onClick={() => void load()} className="rounded-lg border px-3 py-1 text-xs font-semibold">
          Actualizar
        </button>
      </div>

      {loading ? <p className="mt-3 text-zinc-500">Cargando resultados...</p> : null}
      {error ? <p className="mt-3 text-red-600">{error}</p> : null}

      {data ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <article className="rounded-lg border p-3">
            <p className="text-xs text-zinc-500">Ventas hoy</p>
            <p className="mt-1 font-bold">${data.salesToday}</p>
          </article>
          <article className="rounded-lg border p-3">
            <p className="text-xs text-zinc-500">Pedidos hoy</p>
            <p className="mt-1 font-bold">{data.ordersToday}</p>
          </article>
          <article className="rounded-lg border p-3">
            <p className="text-xs text-zinc-500">Ticket promedio</p>
            <p className="mt-1 font-bold">${data.avgTicket}</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}
