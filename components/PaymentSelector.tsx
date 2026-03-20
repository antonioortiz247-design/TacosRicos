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
    <section className="rounded-xl border border-warm-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold">Pago</h3>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {methods.map((method) => (
          <button
            key={method.value}
            onClick={() => setPaymentMethod(method.value)}
            className={`rounded-lg border px-2 py-2 text-sm ${paymentMethod === method.value ? 'border-warm-500 bg-warm-100' : ''}`}
          >
            {method.label}
          </button>
        ))}
      </div>
    </section>
  );
}
