import { Header } from '@/components/Header';
import { OrdersPanel } from '@/components/OrdersPanel';
import { getBusinessOrders } from '@/lib/admin-queries';
import { getRequestedOrConfiguredBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const businessIdentifier = getRequestedOrConfiguredBusinessIdentifier(searchParams?.negocio);
  const orders = await getBusinessOrders(businessIdentifier);
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
      <Header title="Admin · Pedidos" subtitle="Cambiar estado, filtrar y ver detalle" variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
      <div className="mt-4">
        <OrdersPanel initialOrders={orders as any} />
      </div>
    </main>
  );
}
