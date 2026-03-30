import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';
import { RealtimeOrders } from '@/components/RealtimeOrders';
import { ProductPriceManager } from '@/components/ProductPriceManager';
import { getRequestedOrConfiguredBusinessIdentifier, normalizeBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // En una versión final, esto vendría del perfil del usuario logueado
  const businessId = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID || '';

  try {
    const metrics = await getOwnerDashboardMetrics(businessIdentifier);

    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-6xl p-4">
          <Header title={`Admin · ${metrics.businessName}`} subtitle="Ventas y rendimiento del día" />
          {metrics.products.length === 0 && (
            <div className="mb-6 rounded-xl border border-amber-700/50 bg-amber-950/30 p-6">
              <h3 className="text-lg font-bold text-amber-200">No hay productos en la base de datos</h3>
              <p className="mt-1 text-sm text-amber-300">
                Actualmente se muestra el menú de demostración a tus clientes porque la base de datos está vacía para este negocio.
              </p>
            </div>
          )}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <AdminPanel metrics={metrics} />
              <AdminLiveQueriesPanel />
              <RealtimeOrders initialOrders={metrics.recentOrders} businessId={businessId} />
            </div>
            <div className="space-y-4">
              <ProductPriceManager products={metrics.products as any} businessId={businessId} />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-6xl p-4">
          <Header title="Admin · Dashboard" subtitle="Ventas y rendimiento del día" />
          <div className="mt-8 rounded-xl border border-red-700/50 bg-red-950/30 p-8 text-center">
            <h2 className="text-xl font-bold text-red-200">Error al cargar el dashboard</h2>
            <p className="mt-2 text-red-300">
              Asegúrate de que las variables de entorno de Supabase estén configuradas correctamente en Vercel.
            </p>
            <pre className="mt-4 overflow-auto rounded bg-zinc-900 p-4 text-left text-xs text-red-300">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </pre>
          </div>
        </div>
      </main>
    );
  }
}
