import { Header } from '@/components/Header';
import { OrdersPanel } from '@/components/OrdersPanel';

const demoOrders = [
  { id: '1001', customer: 'Luis', total: 180, status: 'pending' as const },
  { id: '1002', customer: 'Ana', total: 240, status: 'preparing' as const },
  { id: '1003', customer: 'Carlos', total: 130, status: 'on_the_way' as const }
];

export default function OrdersPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Pedidos" subtitle="Cambiar estado, filtrar y ver detalle" />
      <div className="mt-4">
        <OrdersPanel initialOrders={demoOrders} />
      </div>
    </main>
  );
}
