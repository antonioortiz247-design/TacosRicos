'use client';

import { PaymentMethod } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';

const methods: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' }
];

export function PaymentSelector() {
  const { paymentMethod, setPaymentMethod } = useCartStore();

  return (
    <section className="surface-card space-y-3">
      <h3 className="section-title">Pago</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {methods.map((method) => (
          <button
            key={method.value}
            onClick={() => setPaymentMethod(method.value)}
            className={`secondary-btn w-full ${paymentMethod === method.value ? 'border-orange-300 bg-amber-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/15 dark:text-orange-200' : ''}`}
          >
            {method.label}
          </button>
        ))}
      </div>
    </section>
  );
}
