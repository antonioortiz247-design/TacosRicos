import { Header } from '@/components/Header';

const rows = [
  { name: 'Burrito', price: 100, active: true },
  { name: 'Gringas', price: 70, active: true },
  { name: 'Pescado rebozado', price: 40, active: true }
];

export default function MenuAdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Menú" subtitle="Crear, editar precio, activar/desactivar" />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
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
