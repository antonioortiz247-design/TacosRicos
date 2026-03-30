import { EventForm } from '@/components/EventForm';
import { FooterActions } from '@/components/FooterActions';
import { Header } from '@/components/Header';
import { buildPathWithNegocio } from '@/lib/business-config';

export default function EventosPage({ params }: { params: { negocio: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl pb-14">
      <Header title={`Eventos · ${params.negocio}`} subtitle="Reserva para celebraciones privadas" isOpen={false} />
      <section className="space-y-4 p-4 sm:p-6">
        <div className="surface-card p-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Tu evento, sin complicaciones</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Cuéntanos la fecha, tipo de servicio y número de invitados. Te confirmamos disponibilidad por WhatsApp.
          </p>
        </div>
        <EventForm waPhone="5215512345678" />
      </section>

      <FooterActions adminHref={buildPathWithNegocio('/admin/login', params.negocio)} />
    </main>
  );
}
