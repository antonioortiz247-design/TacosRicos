'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { MapPin, Store, Truck } from 'lucide-react';

export function DeliverySelector() {
  const { deliveryType, setDelivery, address, setAddress, address_references, setReferences, zone } = useCartStore();

  useEffect(() => {
    if (deliveryType === 'dine_in') {
      setDelivery('pickup');
    }
  }, [deliveryType, setDelivery]);

  return (
    <section className="surface-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Entrega</h3>
        <span className="pill">elige opción</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          onClick={() => setDelivery('dine_in')}
          className={`secondary-btn w-full ${deliveryType === 'dine_in' ? 'border-brand-500/40 bg-white/80 dark:bg-white/10' : ''}`}
        >
          <Store size={16} className="text-brand-600 dark:text-brand-500" />
          En local
        </button>
        <button
          onClick={() => setDelivery('pickup')}
          className={`secondary-btn w-full ${deliveryType === 'pickup' || deliveryType === 'dine_in' ? 'border-brand-500/40 bg-white/80 dark:bg-white/10' : ''}`}
        >
          <MapPin size={16} className="text-brand-600 dark:text-brand-500" />
          Recoger
        </button>
        <button
          onClick={() => setDelivery('delivery', zone)}
          className={`secondary-btn w-full ${deliveryType === 'delivery' ? 'border-brand-500/40 bg-white/80 dark:bg-white/10' : ''}`}
        >
          <Truck size={16} className="text-accent-600 dark:text-accent-500" />
          Domicilio
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
          <input value={address_references} onChange={(e) => setReferences(e.target.value)} placeholder="Referencias" className="input-field" />
        </div>
      ) : null}
      {deliveryType === 'dine_in' ? (
        <div className="space-y-2">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Mesa, barra o nombre del cliente"
            className="input-field"
          />
          <input
            value={address_references}
            onChange={(e) => setReferences(e.target.value)}
            placeholder="Notas para cocina (opcional)"
            className="input-field"
          />
        </div>
      ) : null}
    </section>
  );
}
