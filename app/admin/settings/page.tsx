import { Header } from '@/components/Header';

export default function SettingsPage() {
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
      <Header title="Admin · Ajustes" subtitle="Horarios, zonas envío, WhatsApp y cupones" variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
        <p>Incluye configuración de horarios automáticos, zonas de entrega, número de WhatsApp y cupones.</p>
      </section>
    </main>
  );
}
