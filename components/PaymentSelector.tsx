'use client';

import { PaymentMethod } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { Banknote, CreditCard } from 'lucide-react';

const methods: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' }
];

export function PaymentSelector() {
  const { paymentMethod, setPaymentMethod } = useCartStore();

  return (
    <section className="surface-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Pago</h3>
        <span className="pill">rápido</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {methods.map((method) => (
          <button
            key={method.value}
            onClick={() => setPaymentMethod(method.value)}
            className={`secondary-btn w-full ${paymentMethod === method.value ? 'border-brand-500/40 bg-white/80 dark:bg-white/10' : ''}`}
          >
            {method.value === 'cash' ? (
              <Banknote size={16} className="text-brand-600 dark:text-brand-500" />
            ) : (
              <CreditCard size={16} className="text-accent-600 dark:text-accent-500" />
            )}
            {method.label}
          </button>
        ))}
      </div>
    </section>
  );
}
