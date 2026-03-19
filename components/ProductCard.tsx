'use client';

import { Product } from '@/lib/types';

export function ProductCard({ product, onCustomize }: { product: Product; onCustomize: (product: Product) => void }) {
  return (
    <article className="rounded-2xl border border-warm-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-zinc-500">{product.description}</p>
          <p className="mt-2 font-bold text-warm-700">${product.price}</p>
        </div>
        <button
          onClick={() => onCustomize(product)}
          className="rounded-xl bg-warm-500 px-3 py-2 text-sm font-semibold text-white"
        >
          Personalizar
        </button>
      </div>
    </article>
  );
}
