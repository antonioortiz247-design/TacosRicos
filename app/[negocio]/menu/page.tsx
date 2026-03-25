import { Cart } from '@/components/Cart';
import { DeliverySelector } from '@/components/DeliverySelector';
import { FooterActions } from '@/components/FooterActions';
import { Header } from '@/components/Header';
import { MenuList } from '@/components/MenuList';
import { PaymentSelector } from '@/components/PaymentSelector';
import { Product } from '@/lib/types';
import { getBusinessBySlug, getBusinessProducts, getBusinessSettings } from '@/lib/admin-queries';
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

export default async function BusinessMenuPage({ params }: { params: { negocio: string } }) {
  // Intentar obtener el negocio real desde la base de datos
  const business = await getBusinessBySlug(params.negocio);
  
  // Si no existe, redirigir al inicio en lugar de 404
  if (!business) {
    redirect('/');
  }

  // Obtener productos desde la DB
  const products = await getBusinessProducts(business.id) as any as Product[];

  // Obtener configuración del negocio (teléfono de WhatsApp)
  const settings = await getBusinessSettings(business.id);
  const waPhone = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WA_PHONE || "5586495622";

  const businessDisplayName = business.name;
  const businessId = business.id;

  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-24">
      <Header title={businessDisplayName} subtitle="Pide en segundos" eventHref={`/${params.negocio}/eventos`} />

      <section className="grid gap-4 p-4 md:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] md:gap-5 md:p-6">
        <div className="space-y-3">
          <div className="surface-card p-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Menú del día</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecciona tus favoritos, personaliza y confirma tu pedido en WhatsApp.</p>
          </div>
          {products.length > 0 ? (
            <MenuList products={products} />
          ) : (
            <div className="surface-card p-12 text-center">
              <p className="text-slate-500">No hay productos disponibles en este momento.</p>
            </div>
          )}
        </div>

        <div className="space-y-4 md:sticky md:top-[92px] md:self-start">
          <DeliverySelector />
          <PaymentSelector />
          <Cart waPhone={waPhone} businessName={businessDisplayName} businessId={businessId} />
        </div>
      </section>

      <FooterActions dashboardHref="/admin/login" />
    </main>
  );
}
