import { Header } from '@/components/Header';
import { OrdersPanel } from '@/components/OrdersPanel';
import { getBusinessOrders } from '@/lib/admin-queries';
import { getRequestedOrConfiguredBusinessIdentifier } from '@/lib/business-config';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function OrdersPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const businessIdentifier = getRequestedOrConfiguredBusinessIdentifier(searchParams?.negocio);
  const adminNavLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Pedidos' },
    { href: '/admin/waiter', label: 'Mesero' },
    { href: '/admin/kitchen', label: 'Cocina' },
    { href: '/admin/menu', label: 'Menú' },
    { href: '/admin/settings', label: 'Ajustes' }
  ];

  try {
    const orders = await getBusinessOrders(businessIdentifier);
    const firstBusinessId = (orders as any[])?.[0]?.business_id as string | undefined;

    let businessId = firstBusinessId || '';
    if (!businessId && UUID_REGEX.test(businessIdentifier)) {
      businessId = businessIdentifier;
    }

    if (!businessId && businessIdentifier) {
      const adminClient = getSupabaseAdmin();
      if (adminClient) {
        const { data: bySlug } = await adminClient.from('businesses').select('id').eq('slug', businessIdentifier).maybeSingle();
        businessId = bySlug?.id || '';
        if (!businessId) {
          const { data: firstBiz } = await adminClient.from('businesses').select('id').limit(1).maybeSingle();
          businessId = firstBiz?.id || '';
        }
      }
    }

    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4">
        <Header title="Admin · Pedidos" subtitle="Cambiar estado, filtrar y ver detalle" variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
        <div className="mt-4">
          <OrdersPanel initialOrders={orders as any} businessId={businessId} />
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4">
        <Header title="Admin · Pedidos" subtitle="Cambiar estado, filtrar y ver detalle" variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
        <section className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-5 text-center sm:p-7 dark:border-red-900/60 dark:bg-red-900/20">
          <h2 className="text-lg font-extrabold tracking-tight text-red-700 sm:text-xl dark:text-red-200">No se pudieron cargar los pedidos</h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            Verifica que SUPABASE_SERVICE_ROLE_KEY esté configurada en Vercel y que ya ejecutaste el SQL de Supabase.
          </p>
          <pre className="mt-4 overflow-auto rounded-2xl border border-red-200/70 bg-white/80 p-3 text-left text-xs text-red-700 sm:p-4 dark:border-red-900/50 dark:bg-zinc-900 dark:text-red-300">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </pre>
        </section>
      </main>
    );
  }
}
