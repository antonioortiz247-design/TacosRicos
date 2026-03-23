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
            className={`secondary-btn w-full ${paymentMethod === method.value ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200' : ''}`}
          >
            {method.label}
          </button>
        ))}
      </div>
    </section>
  );
}
