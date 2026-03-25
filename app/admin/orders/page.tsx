import { Header } from '@/components/Header';
import { OrdersPanel } from '@/components/OrdersPanel';
import { getBusinessOrders } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const businessId = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID || '';
  const orders = await getBusinessOrders(businessId);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Pedidos" subtitle="Cambiar estado, filtrar y ver detalle" />
      <div className="mt-4">
        <OrdersPanel initialOrders={orders as any} />
      </div>
    </main>
  );
}
