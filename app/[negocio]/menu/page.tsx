import { Cart } from '@/components/Cart';
import { DeliverySelector } from '@/components/DeliverySelector';
import { EventForm } from '@/components/EventForm';
import { Header } from '@/components/Header';
import { MenuList } from '@/components/MenuList';
import { PaymentSelector } from '@/components/PaymentSelector';
import { Product } from '@/lib/types';

const fallbackProducts: Product[] = [
  { id: '1', businessId: 'demo', category: 'tacos', name: 'Taco al pastor', price: 30, active: true },
  { id: '2', businessId: 'demo', category: 'especialidades', name: 'Gringa especial', price: 60, active: true },
  { id: '3', businessId: 'demo', category: 'promociones', name: '2x1 Martes', price: 30, active: true }
];

export default function BusinessMenuPage({ params }: { params: { negocio: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-24">
      <Header title={`Taquería ${params.negocio}`} subtitle="Pide en segundos" />
      <section className="grid gap-4 p-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <MenuList products={fallbackProducts} />
          <EventForm waPhone="5215512345678" />
        </div>
        <div className="space-y-4">
          <DeliverySelector />
          <PaymentSelector />
          <Cart waPhone="5215512345678" businessName={params.negocio} />
        </div>
      </section>
    </main>
  );
}
