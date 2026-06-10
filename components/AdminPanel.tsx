'use client';

type Metrics = {
  sales: number;
  orders: number;
  avgTicket: number;
  topProducts: string;
};

export function AdminPanel({ metrics }: { metrics: Metrics }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Ventas del día" value={`$${metrics.sales}`} />
      <Card label="Total de pedidos" value={`${metrics.orders}`} />
      <Card label="Ticket promedio" value={`$${metrics.avgTicket}`} />
      <Card label="Más vendidos" value={metrics.topProducts} />
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
      <p className="text-xs text-ink-500 dark:text-ink-300">{label}</p>
      <p className="mt-2 font-display text-lg font-bold text-ink-900 dark:text-ink-50">{value}</p>
    </article>
  );
}
