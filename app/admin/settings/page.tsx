import { Header } from '@/components/Header';

export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Ajustes" subtitle="Horarios, delivery, mínimos, cupones" />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm">
        <p>Configura horarios automáticos, zonas de entrega, pedido mínimo y métodos de pago.</p>
      </section>
    </main>
  );
}
