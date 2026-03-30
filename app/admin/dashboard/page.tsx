import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';
import { RealtimeOrders } from '@/components/RealtimeOrders';
import { ProductPriceManager } from '@/components/ProductPriceManager';
import { getRequestedOrConfiguredBusinessIdentifier, normalizeBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const requestedBusiness = normalizeBusinessIdentifier(searchParams?.negocio);
  const businessIdentifier = getRequestedOrConfiguredBusinessIdentifier(requestedBusiness);
  
  try {
    const metrics = await getOwnerDashboardMetrics(businessIdentifier);

    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4">
        <Header title={`Admin · ${metrics.businessName}`} subtitle="Ventas y rendimiento del día" />
        {metrics.products.length === 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/10">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">No hay productos en la base de datos</h3>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
              Actualmente se muestra el menú de demostración a tus clientes porque la base de datos está vacía para este negocio.
            </p>
          </div>
        )}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <AdminPanel metrics={metrics} />
            <AdminLiveQueriesPanel negocio={requestedBusiness} />
            <RealtimeOrders initialOrders={metrics.recentOrders} businessId={metrics.businessId} />
          </div>
          <div className="space-y-4">
            <ProductPriceManager products={metrics.products as any} businessId={metrics.businessId} />
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
