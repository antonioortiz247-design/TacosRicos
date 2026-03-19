import { EventForm } from '@/components/EventForm';
import { Header } from '@/components/Header';

export default function EventosPage({ params }: { params: { negocio: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl p-4">
      <Header title={`Eventos · ${params.negocio}`} subtitle="Reserva para celebraciones privadas" isOpen={false} />
      <div className="mt-4">
        <EventForm waPhone="5215512345678" />
      </div>
    </main>
  );
}
