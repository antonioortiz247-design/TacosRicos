import { AdminPanel } from '@/components/AdminPanel';
import { Header } from '@/components/Header';

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Dashboard" subtitle="Métricas en tiempo real" />
      <div className="mt-4">
        <AdminPanel metrics={{ sales: 12450, orders: 172, avgTicket: 72, topProduct: 'Taco al pastor' }} />
      </div>
    </main>
  );
}
