import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';
import { RealtimeOrders } from '@/components/RealtimeOrders';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const businessId = 'demo';
  const metrics = await getOwnerDashboardMetrics(businessId);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Dashboard" subtitle="Ventas y rendimiento del día" />
      <div className="mt-4 space-y-4">
        <AdminPanel metrics={metrics} />
        <AdminLiveQueriesPanel />
        <RealtimeOrders initialOrders={metrics.recentOrders} businessId={businessId} />
      </div>
    </main>
  );
}
