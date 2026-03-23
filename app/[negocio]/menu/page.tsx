import { Cart } from '@/components/Cart';
import { DeliverySelector } from '@/components/DeliverySelector';
import { FooterActions } from '@/components/FooterActions';
import { Header } from '@/components/Header';
import { MenuList } from '@/components/MenuList';
import { PaymentSelector } from '@/components/PaymentSelector';
import { Product } from '@/lib/types';

const baseProducts = ['Barriga', 'Suadero', 'Pechuga', 'Longaniza', 'Chile Relleno', 'Campechanos', 'Chorizo Argentino', 'Chuleta'];

const fallbackProducts: Product[] = [
  ...baseProducts.map((name, idx) => ({
    id: `t-${idx + 1}`,
    businessId: 'demo',
    category: 'tacos' as const,
    name,
    price: 32,
    active: true,
    customizable: true,
    // Ojo: en Next.js las rutas públicas van como '/archivo.ext', no 'public/archivo.ext'.
    imageUrl: name === 'Pechuga' ? '/TacodePechuga.png' : undefined,
    imageUrl: nombre === 'Suadero' ? '/TacodeSuadero.png' : undefined,
  })),
  { id: 'e-1', businessId: 'demo', category: 'especialidades', name: 'Burrito', price: 100, active: true, customizable: true, imageUrl: nombre === 'Suadero' ? '/TacodeSuadero.png' : undefined, },
  { id: 'e-2', businessId: 'demo', category: 'especialidades', name: 'Gringas', price: 70, active: true, customizable: true },
  { id: 'v-1', businessId: 'demo', category: 'viernes', name: 'Quesadillas de camarón', price: 40, active: true },
  { id: 'm-1', businessId: 'demo', category: 'miercoles', name: 'Papas rellenas', price: 90, active: true },
  {
    id: 'j-1',
    businessId: 'demo',
    category: 'jueves',
    name: 'Pescado rebozado',
    price: 120,
    description: 'Precio editable en admin',
    active: true,
  },
];

export default function BusinessMenuPage({ params }: { params: { negocio: string } }) {
  const businessDisplayName = params.negocio.toLowerCase() === 'demo' ? 'Tacos Rico´s' : `Taquería ${params.negocio}`;

  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-24">
      <Header title={businessDisplayName} subtitle="Pide en segundos" eventHref={`/${params.negocio}/eventos`} />

      <section className="grid gap-4 p-4 md:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] md:gap-5 md:p-6">
        <div className="space-y-3">
          <div className="surface-card p-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Menú del día</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecciona tus favoritos, personaliza y confirma tu pedido en WhatsApp.</p>
          </div>
          <MenuList products={fallbackProducts} />
        </div>

        <div className="space-y-4 md:sticky md:top-[92px] md:self-start">
          <DeliverySelector />
          <PaymentSelector />
          <Cart waPhone="5215512345678" businessName={businessDisplayName} />
        </div>
      </section>

      <FooterActions dashboardHref="/admin/login" />
    </main>
  );
}
