import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';
import { RealtimeOrders } from '@/components/RealtimeOrders';
import { ProductPriceManager } from '@/components/ProductPriceManager';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // En una versión final, esto vendría del perfil del usuario logueado
  const businessIdentifier =
    process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID ||
    process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG ||
    'tacos-ricos';

  try {
    // Obtener métricas y productos reales del negocio
    const metrics = await getOwnerDashboardMetrics(businessIdentifier);

    return (
      <main className="min-h-screen">
        <Header title={`Admin · ${metrics.businessName}`} subtitle="Ventas y rendimiento del día" />
        <div className="mx-auto w-full max-w-6xl space-y-4 px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-5 md:space-y-5">
          {metrics.products.length === 0 && (
            <section className="surface-card border-amber-200/70 bg-amber-50/80 p-4 sm:p-5 dark:border-amber-900/50 dark:bg-amber-900/20">
              <h3 className="text-base font-extrabold tracking-tight text-amber-800 sm:text-lg dark:text-amber-200">
                No hay productos en la base de datos
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Actualmente se muestra el menú de demostración a tus clientes porque la base de datos está vacía para este negocio.
              </p>
            </section>
          )}

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
            <div className="space-y-4">
              <div className="surface-card p-3 sm:p-4">
                <AdminPanel metrics={metrics} />
              </div>
              <div className="surface-card p-3 sm:p-4">
                <AdminLiveQueriesPanel />
              </div>
              <div className="surface-card p-3 sm:p-4">
                <RealtimeOrders initialOrders={metrics.recentOrders} businessId={businessIdentifier} />
              </div>
            </div>

            <div className="space-y-4">
              <ProductPriceManager products={metrics.products as any} businessId={businessIdentifier} />
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <main className="min-h-screen">
        <Header title="Admin · Dashboard" subtitle="Ventas y rendimiento del día" />
        <div className="mx-auto w-full max-w-3xl px-3 pb-8 pt-6 sm:px-4">
          <section className="surface-card border-red-200/80 bg-red-50/90 p-5 text-center sm:p-7 dark:border-red-900/60 dark:bg-red-900/20">
            <h2 className="text-lg font-extrabold tracking-tight text-red-700 sm:text-xl dark:text-red-200">
              Error al cargar el dashboard
            </h2>
            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
              Asegúrate de que las variables de entorno de Supabase estén configuradas correctamente en Vercel.
            </p>
            <pre className="mt-4 overflow-auto rounded-2xl border border-red-200/70 bg-white/80 p-3 text-left text-xs text-red-700 sm:p-4 dark:border-red-900/50 dark:bg-zinc-900 dark:text-red-300">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </pre>
          </section>
        </div>
      </main>
    );
  }
}
