import { Header } from '@/components/Header';
import { WaiterOrderPanel } from '@/components/WaiterOrderPanel';
import { getOrderEntryData } from '@/lib/admin-queries';
import { getRequestedOrConfiguredBusinessIdentifier } from '@/lib/business-config';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

const baseProducts = ['Barriga', 'Suadero', 'Pechuga', 'Longaniza', 'Chile Relleno', 'Campechanos', 'Chorizo Argentino', 'Chuleta'];

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
  Gringas: 'TacodeSuadero.png'
};

function getProductImageUrl(productName: string): string | undefined {
  const fileName = PRODUCT_IMAGE_FILE_NAMES[productName]?.trim();
  return fileName ? `/${fileName}` : undefined;
}

function getFallbackProducts(businessId: string): Product[] {
  return [
    ...baseProducts.map((name, idx) => ({
      id: `waiter-t-${idx + 1}`,
      businessId,
      category: 'tacos' as const,
      name,
      price: 32,
      active: true,
      customizable: true,
      imageUrl: getProductImageUrl(name)
    })),
    {
      id: 'waiter-e-1',
      businessId,
      category: 'especialidades' as const,
      name: 'Burrito',
      price: 100,
      active: true,
      customizable: true,
      imageUrl: getProductImageUrl('Burrito')
    },
    {
      id: 'waiter-e-2',
      businessId,
      category: 'especialidades' as const,
      name: 'Gringas',
      price: 70,
      active: true,
      customizable: true,
      imageUrl: getProductImageUrl('Gringas')
    }
  ];
}

function getConfiguredWaiters() {
  return (process.env.WAITER_NAMES || 'Mesero 1,Mesero 2,Mesero 3')
    .split(',')
    .map((waiter) => waiter.trim())
    .filter(Boolean);
}

export default async function WaiterPage({ searchParams }: { searchParams?: { negocio?: string } }) {
  const businessIdentifier = getRequestedOrConfiguredBusinessIdentifier(searchParams?.negocio);
  const { businessId, businessName, products } = await getOrderEntryData(businessIdentifier);
  const menuProducts = products.length > 0 ? products : getFallbackProducts(businessId);
  const adminNavLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Pedidos' },
    { href: '/admin/waiter', label: 'Mesero' },
    { href: '/admin/kitchen', label: 'Cocina' },
    { href: '/admin/menu', label: 'Menú' },
    { href: '/admin/settings', label: 'Ajustes' }
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Mesero" subtitle={`Comandas en local · ${businessName}`} variant="admin" backHref="/admin/dashboard" navLinks={adminNavLinks} />
      <div className="mt-4">
        <WaiterOrderPanel products={menuProducts} businessId={businessId} businessName={businessName} waiters={getConfiguredWaiters()} />
      </div>
    </main>
  );
}
