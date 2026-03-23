'use client';

import { useCartStore } from '@/store/cart-store';

export function DeliverySelector() {
  const { deliveryType, setDelivery, address, setAddress, references, setReferences, zone } = useCartStore();

  return (
    <section className="surface-card space-y-3">
      <h3 className="section-title">Entrega</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          onClick={() => setDelivery('pickup')}
          className={`secondary-btn w-full ${deliveryType === 'pickup' ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200' : ''}`}
        >
          Recoger en local
        </button>
        <button
          onClick={() => setDelivery('delivery', zone)}
          className={`secondary-btn w-full ${deliveryType === 'delivery' ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200' : ''}`}
        >
          Envío a domicilio
        </button>
      </div>
      {deliveryType === 'delivery' ? (
        <div className="space-y-2">
          <select
            onChange={(e) => setDelivery('delivery', e.target.value as 'zona1' | 'zona2' | 'zona3')}
            value={zone}
            className="input-field"
            aria-label="Zona de entrega"
          >
            <option value="zona1">Zona 1 ($20)</option>
            <option value="zona2">Zona 2 ($30)</option>
            <option value="zona3">Zona 3 ($40)</option>
          </select>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección" className="input-field" />
          <input value={references} onChange={(e) => setReferences(e.target.value)} placeholder="Referencias" className="input-field" />
        </div>
      ) : null}
    </section>
  );
}
