import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';

export default async function DashboardPage() {
  const businessId = 'demo';
  const metrics = await getOwnerDashboardMetrics(businessId);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Dashboard dueño" subtitle="Ventas y rendimiento del día" />
      <div className="mt-4 space-y-4">
        <AdminPanel metrics={metrics} />
        <AdminLiveQueriesPanel />
        <section className="rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
          <h2 className="font-semibold">Pedidos recientes</h2>
          <ul className="mt-2 space-y-2">
            {metrics.recentOrders.map((row) => (
              <li key={row.id} className="rounded border p-2">#{row.id} · ${row.total} · {row.status}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
