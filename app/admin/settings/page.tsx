import { Header } from '@/components/Header';

export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Ajustes" subtitle="Horarios, zonas envío, WhatsApp y cupones" />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
        <p>Incluye configuración de horarios automáticos, zonas de entrega, número de WhatsApp y cupones.</p>
      </section>
    </main>
  );
}
