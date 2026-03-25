import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';
import { RealtimeOrders } from '@/components/RealtimeOrders';
import { ProductPriceManager } from '@/components/ProductPriceManager';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // En una versión final, esto vendría del perfil del usuario logueado
  const businessId = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID || '';
  
  try {
    if (!businessId) {
      throw new Error('ID de negocio no configurado. Por favor añade NEXT_PUBLIC_DEFAULT_BUSINESS_ID a tus variables de entorno.');
    }

    const metrics = await getOwnerDashboardMetrics(businessId);

    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4">
        <Header title="Admin · Dashboard" subtitle="Ventas y rendimiento del día" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <AdminPanel metrics={metrics} />
            <AdminLiveQueriesPanel />
            <RealtimeOrders initialOrders={metrics.recentOrders} businessId={businessId} />
          </div>
          <div className="space-y-4">
            <ProductPriceManager products={metrics.products as any} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4">
        <Header title="Admin · Dashboard" subtitle="Ventas y rendimiento del día" />
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-900/10">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200">Error al cargar el dashboard</h2>
          <p className="mt-2 text-red-600 dark:text-red-400">
            Asegúrate de que las variables de entorno de Supabase estén configuradas correctamente en Vercel.
          </p>
          <pre className="mt-4 overflow-auto rounded bg-white p-4 text-left text-xs text-red-500 dark:bg-zinc-950">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </pre>
        </div>
      </main>
    );
  }
}
