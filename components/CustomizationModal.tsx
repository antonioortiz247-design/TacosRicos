'use client';

import { useMemo, useState } from 'react';
import { calculateTacoPrice } from '@/lib/pricing';
import { Product, TacoConfig } from '@/lib/types';

const proteinOptions = ['Barriga', 'Suadero', 'Pechuga', 'Longaniza', 'Chile relleno', 'Campechano', 'Chorizo argentino', 'Chuleta'];

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
  const [protein, setProtein] = useState(proteinOptions[0]);
  const [notes, setNotes] = useState('');
  const canSelectProtein = product.category === 'especialidades' && (product.name === 'Burrito' || product.name === 'Gringas');
  const canSelectTacoOptions = !canSelectProtein;

  const unitPrice = useMemo(() => calculateTacoPrice({ tortilla, extras, notes }, product.price), [extras, notes, product.price, tortilla]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-end bg-slate-950/50 p-2 sm:place-items-center">
      <div className="glass-effect w-full max-w-lg rounded-2xl p-4 shadow-2xl">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50">{product.name}</h2>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Personaliza tu pedido y agrega notas si lo necesitas.</p>

        <div className="mt-4 space-y-4 text-sm">
          {canSelectTacoOptions ? (
            <>
              <div>
                <label className="font-semibold text-ink-700 dark:text-ink-200">Tortilla</label>
                <div className="mt-2 flex gap-2">
                  {(['maiz', 'harina'] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setTortilla(item)}
                      className={`secondary-btn px-3 py-2 capitalize ${tortilla === item ? 'border-brand-500/40 bg-white/80 dark:bg-white/10' : ''}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink-700 dark:text-ink-200">Extras</label>
                <div className="mt-2 flex gap-2">
                  {(['queso', 'papas'] as const).map((extra) => (
                    <button
                      key={extra}
                      onClick={() =>
                        setExtras((prev) => (prev.includes(extra) ? prev.filter((item) => item !== extra) : [...prev, extra]))
                      }
                      className={`secondary-btn px-3 py-2 capitalize ${extras.includes(extra) ? 'border-accent-500/40 bg-white/80 dark:bg-white/10' : ''}`}
                    >
                      {extra}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {canSelectProtein ? (
            <div>
              <label className="font-semibold text-ink-700 dark:text-ink-200">Ingrediente</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {proteinOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => setProtein(item)}
                    className={`secondary-btn px-3 py-2 ${protein === item ? 'border-brand-500/40 bg-white/80 dark:bg-white/10' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas" className="input-field min-h-24 resize-none" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold text-brand-600 dark:text-brand-500">${unitPrice}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="secondary-btn px-4 py-2 text-sm">
              Cerrar
            </button>
            <button
              onClick={() =>
                onConfirm(
                  {
                    tortilla: canSelectProtein ? 'maiz' : tortilla,
                    extras: canSelectProtein ? [] : extras,
                    protein: canSelectProtein ? protein : undefined,
                    notes
                  },
                  unitPrice
                )
              }
              className="primary-btn px-4 py-2 text-sm"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
