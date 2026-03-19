'use client';

type Metrics = {
  sales: number;
  orders: number;
  avgTicket: number;
  topProduct: string;
};

export function AdminPanel({ metrics }: { metrics: Metrics }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Ventas" value={`$${metrics.sales}`} />
      <Card label="Pedidos" value={`${metrics.orders}`} />
      <Card label="Ticket promedio" value={`$${metrics.avgTicket}`} />
      <Card label="Más vendido" value={metrics.topProduct} />
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-warm-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </article>
  );
}
