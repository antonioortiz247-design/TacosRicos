import { Header } from '@/components/Header';
import { KitchenOrdersPanel } from '@/components/KitchenOrdersPanel';
import { getKitchenOrders } from '@/lib/admin-queries';
import { getRequestedOrConfiguredBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function KitchenPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const businessIdentifier = getRequestedOrConfiguredBusinessIdentifier(searchParams?.negocio);
  const { businessId, orders } = await getKitchenOrders(businessIdentifier);
  const adminNavLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Pedidos' },
    { href: '/admin/waiter', label: 'Mesero' },
    { href: '/admin/kitchen', label: 'Cocina' },
    { href: '/admin/menu', label: 'Menú' },
    { href: '/admin/settings', label: 'Ajustes' }
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Cocina" subtitle="Pedidos en local para preparar y surtir" variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
      <div className="mt-4">
        <KitchenOrdersPanel initialOrders={orders} businessId={businessId} />
      </div>
    </main>
  );
}
