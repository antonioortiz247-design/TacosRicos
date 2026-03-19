import { Header } from '@/components/Header';

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered'];

export default function OrdersPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Pedidos" subtitle="Seguimiento de estados" />
      <section className="mt-4 rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Estados soportados</h2>
        <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {statuses.map((status) => (
            <li key={status} className="rounded border p-2">
              {status}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
