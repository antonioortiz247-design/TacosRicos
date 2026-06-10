import { Header } from '@/components/Header';
import Link from 'next/link';

const rows = [
  { name: 'Burrito', price: 100, active: true },
  { name: 'Gringas', price: 70, active: true },
  { name: 'Pescado rebozado', price: 40, active: true }
];

export default function MenuAdminPage() {
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
      <Header title="Admin · Menú" subtitle="Crear, editar precio, activar/desactivar" variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">Configuración avanzada de menú y disponibilidad.</p>
          <Link href="/admin/dashboard#precios" className="secondary-btn px-3 py-2 text-xs">
            Editar precios
          </Link>
        </div>
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.name} className="flex items-center justify-between rounded border p-2">
              <span>{row.name}</span>
              <span>${row.price}</span>
              <button className="rounded border px-2 py-1">{row.active ? 'Activo' : 'Inactivo'}</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
