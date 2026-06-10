import { Header } from '@/components/Header';
import { KitchenOrdersPanel } from '@/components/KitchenOrdersPanel';
import { getKitchenOrders } from '@/lib/admin-queries';
import { getRequestedOrConfiguredBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function KitchenPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const businessIdentifier = getRequestedOrConfiguredBusinessIdentifier(searchParams?.negocio);
  const { businessId, orders } = await getKitchenOrders(businessIdentifier);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Cocina" subtitle="Pedidos en local para preparar y surtir" />
      <div className="mt-4">
        <KitchenOrdersPanel initialOrders={orders} businessId={businessId} />
      </div>
    </main>
  );
}
