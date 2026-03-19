import { Header } from '@/components/Header';

export default function MenuAdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Menú" subtitle="CRUD de productos" />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm">
        <p>Funciones: crear, editar, activar/desactivar productos.</p>
      </section>
    </main>
  );
}
