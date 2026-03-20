import { Cart } from '@/components/Cart';
import { DeliverySelector } from '@/components/DeliverySelector';
import { Header } from '@/components/Header';
import { MenuList } from '@/components/MenuList';
import { PaymentSelector } from '@/components/PaymentSelector';
import { Product } from '@/lib/types';

const baseProducts = [
  'Barriga',
  'Suadero',
  'Pechuga',
  'Longaniza',
  'Chile Relleno',
  'Campechanos',
  'Chorizo Argentino',
  'Chuleta'
];

const fallbackProducts: Product[] = [
  ...baseProducts.map((name, idx) => ({
    id: `t-${idx + 1}`,
    businessId: 'demo',
    category: 'tacos' as const,
    name,
    price: 32,
    active: true,
    customizable: true
  })),
  { id: 'e-1', businessId: 'demo', category: 'especialidades', name: 'Burrito', price: 100, active: true },
  { id: 'e-2', businessId: 'demo', category: 'especialidades', name: 'Gringas', price: 70, active: true },
  { id: 'v-1', businessId: 'demo', category: 'viernes', name: 'Quesadillas de camarón', price: 40, active: true },
  { id: 'm-1', businessId: 'demo', category: 'miercoles', name: 'Papas rellenas', price: 90, active: true },
  {
    id: 'j-1',
    businessId: 'demo',
    category: 'jueves',
    name: 'Pescado rebozado',
    price: 120,
    description: 'Precio editable en admin',
    active: true
  }
];

export default function BusinessMenuPage({ params }: { params: { negocio: string } }) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-24">
      <Header
        title={`Taquería ${params.negocio}`}
        subtitle="Pide en segundos"
        eventHref={`/${params.negocio}/eventos`}
        dashboardHref="/admin/login"
      />
      <section className="grid gap-4 p-4 md:grid-cols-[2fr_1fr]">
        <MenuList products={fallbackProducts} />
        <div className="space-y-4">
          <DeliverySelector />
          <PaymentSelector />
          <Cart waPhone="5215512345678" businessName={params.negocio} />
        </div>
      </section>
    </main>
  );
}
