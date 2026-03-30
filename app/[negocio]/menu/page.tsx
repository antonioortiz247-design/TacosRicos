import { Cart } from '@/components/Cart';
import { DeliverySelector } from '@/components/DeliverySelector';
import { FooterActions } from '@/components/FooterActions';
import { Header } from '@/components/Header';
import { MenuList } from '@/components/MenuList';
import { PaymentSelector } from '@/components/PaymentSelector';
import { Product } from '@/lib/types';
import { getBusinessBySlug, getBusinessProducts, getBusinessSettings } from '@/lib/admin-queries';
import { buildPathWithNegocio } from '@/lib/business-config';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const baseProducts = ['Barriga', 'Suadero', 'Pechuga', 'Longaniza', 'Chile Relleno', 'Campechanos', 'Chorizo Argentino', 'Chuleta'];

// Reemplaza "archivo.ext" por el nombre real de archivo (ej: pechuga.jpg o productos/pechuga.jpg).
const PRODUCT_IMAGE_FILE_NAMES: Partial<Record<string, string>> = {
  Barriga: 'TacodeBarriga.jpg',
  Suadero: 'TacodeSuadero.png',
  Pechuga: 'TacodePechuga.jpg',
  Longaniza: 'TacodeLonganiza.jpg',
  'Chile Relleno': 'TacodeChile.jpg',
  Campechanos: 'TacoCampechano.jpg',
  'Chorizo Argentino': 'TacoArgentino.jpg',
  Chuleta: 'TacodeChuleta.jpg',
  Burrito: 'TacodePechuga.png',
  Gringas: 'TacodeSuadero.png',
  'Quesadillas de camarón': 'TacodePechuga.png',
  'Papas rellenas': 'TacodeSuadero.png',
  'Pescado rebozado': 'TacodePechuga.png'
};

function getProductImageUrl(productName: string): string | undefined {
  const fileName = PRODUCT_IMAGE_FILE_NAMES[productName]?.trim();

  if (!fileName || fileName === 'archivo.ext') {
    return undefined;
  }

  return fileName.startsWith('/') ? fileName : `/${fileName}`;
}

const fallbackProducts: Product[] = [
  ...baseProducts.map((name, idx) => ({
    id: `t-${idx + 1}`,
    businessId: 'default',
    category: 'tacos' as const,
    name,
    price: 32,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl(name)
  })),
  {
    id: 'e-1',
    businessId: 'default',
    category: 'especialidades',
    name: 'Burrito',
    price: 100,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Burrito')
  },
  {
    id: 'e-2',
    businessId: 'default',
    category: 'especialidades',
    name: 'Gringas',
    price: 70,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Gringas')
  }
];

export default async function BusinessMenuPage({ params }: { params: { negocio: string } }) {
  // Intentar obtener el negocio real desde la base de datos
  const business = await getBusinessBySlug(params.negocio);
  
  // Obtener configuración del negocio (teléfono de WhatsApp)
  const settings = business ? await getBusinessSettings(business.id) : null;
  const waPhone = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WA_PHONE || "5586495622";

  const businessDisplayName = business?.name || (params.negocio === 'tacos-ricos' ? 'Tacos Rico´s' : params.negocio);
  const businessId = business?.id || params.negocio;

  // Obtener productos desde la DB
  let dbProducts = business ? await getBusinessProducts(business.id) : [];
  
  // SI NO HAY PRODUCTOS EN DB, usamos el fallback del demo para asegurar que siempre haya contenido
  const products = dbProducts.length > 0 ? (dbProducts as any as Product[]) : fallbackProducts;

  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-24">
      <Header title={businessDisplayName} subtitle="Pide en segundos" eventHref={`/${params.negocio}/eventos`} />

      <section className="grid gap-4 p-4 md:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] md:gap-5 md:p-6">
        <div className="space-y-3">
          <div className="surface-card p-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Menú del día</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecciona tus favoritos, personaliza y confirma tu pedido en WhatsApp.</p>
          </div>
          <MenuList products={products} />
        </div>

        <div className="space-y-4 md:sticky md:top-[92px] md:self-start">
          <DeliverySelector />
          <PaymentSelector />
          <Cart waPhone={waPhone} businessName={businessDisplayName} businessId={businessId} />
        </div>
      </section>

      <FooterActions adminHref={buildPathWithNegocio('/admin/login', params.negocio)} />
    </main>
  );
}
