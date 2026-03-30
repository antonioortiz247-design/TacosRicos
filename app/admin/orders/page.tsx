import { Header } from '@/components/Header';
import { OrdersPanel } from '@/components/OrdersPanel';
import { getBusinessOrders } from '@/lib/admin-queries';
import { getConfiguredBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const businessId = getConfiguredBusinessIdentifier();
  const requestedBusiness = searchParams?.negocio?.trim() || '';
  const orders = await getBusinessOrders(requestedBusiness || businessId);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Pedidos" subtitle="Cambiar estado, filtrar y ver detalle" />
      <div className="mt-4">
        <OrdersPanel initialOrders={orders as any} />
      </div>
    </main>
  );
}
