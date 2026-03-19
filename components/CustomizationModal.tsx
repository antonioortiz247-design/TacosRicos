'use client';

import { useMemo, useState } from 'react';
import { calculateTacoPrice } from '@/lib/pricing';
import { Product, TacoConfig } from '@/lib/types';

export function CustomizationModal({
  product,
  onClose,
  onConfirm
}: {
  product: Product;
  onClose: () => void;
  onConfirm: (config: TacoConfig, unitPrice: number) => void;
}) {
  const [tortilla, setTortilla] = useState<TacoConfig['tortilla']>('maiz');
  const [extras, setExtras] = useState<TacoConfig['extras']>([]);
  const [notes, setNotes] = useState('');

  const unitPrice = useMemo(() => calculateTacoPrice({ tortilla, extras, notes }), [tortilla, extras, notes]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-end bg-black/30 p-2">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 dark:bg-zinc-900">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <label className="font-semibold">Tortilla</label>
            <div className="mt-1 flex gap-2">
              {(['maiz', 'harina'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setTortilla(item)}
                  className={`rounded-lg border px-3 py-1 ${tortilla === item ? 'border-warm-500 bg-warm-100' : 'border-zinc-300'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Extras</label>
            <div className="mt-1 flex gap-2">
              {(['queso', 'papas'] as const).map((extra) => (
                <button
                  key={extra}
                  onClick={() =>
                    setExtras((prev) => (prev.includes(extra) ? prev.filter((item) => item !== extra) : [...prev, extra]))
                  }
                  className={`rounded-lg border px-3 py-1 ${extras.includes(extra) ? 'border-warm-500 bg-warm-100' : 'border-zinc-300'}`}
                >
                  {extra}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas"
            className="w-full rounded-lg border border-zinc-300 p-2"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-warm-700">${unitPrice}</span>
          <div className="space-x-2">
            <button onClick={onClose} className="rounded-lg border px-3 py-2 text-sm">
              Cerrar
            </button>
            <button
              onClick={() => onConfirm({ tortilla, extras, notes }, unitPrice)}
              className="rounded-lg bg-warm-500 px-3 py-2 text-sm font-semibold text-white"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
