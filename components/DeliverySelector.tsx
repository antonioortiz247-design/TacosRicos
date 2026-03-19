'use client';

import { useCartStore } from '@/store/cart-store';

export function DeliverySelector() {
  const { deliveryType, setDelivery, address, setAddress, references, setReferences, zone } = useCartStore();

  return (
    <section className="rounded-xl border border-warm-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold">Entrega</h3>
      <div className="mt-2 flex gap-2">
        <button onClick={() => setDelivery('pickup')} className="rounded-lg border px-3 py-2 text-sm">
          Recoger en local
        </button>
        <button onClick={() => setDelivery('delivery', zone)} className="rounded-lg border px-3 py-2 text-sm">
          Envío a domicilio
        </button>
      </div>
      {deliveryType === 'delivery' ? (
        <div className="mt-2 space-y-2">
          <select onChange={(e) => setDelivery('delivery', e.target.value as 'zona1' | 'zona2' | 'zona3')} className="w-full rounded-lg border p-2">
            <option value="zona1">Zona 1 ($20)</option>
            <option value="zona2">Zona 2 ($30)</option>
            <option value="zona3">Zona 3 ($40)</option>
          </select>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección" className="w-full rounded-lg border p-2" />
          <input value={references} onChange={(e) => setReferences(e.target.value)} placeholder="Referencias" className="w-full rounded-lg border p-2" />
        </div>
      ) : null}
    </section>
  );
}
