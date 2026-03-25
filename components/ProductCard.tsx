'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';

export function ProductCard({
  product,
  onCustomize,
  onAdd
}: {
  product: Product;
  onCustomize: (product: Product) => void;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="surface-card group overflow-hidden p-3 sm:p-4">
      <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-slate-500">Imagen del producto</div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
          {product.description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.description}</p> : null}
          <p className="mt-3 text-lg font-bold tracking-tight text-orange-700 dark:text-amber-200">${product.price}</p>
        </div>
        {product.customizable ? (
          <button onClick={() => onCustomize(product)} className="primary-btn shrink-0 px-3 py-2 text-xs sm:text-sm">
            Personalizar
          </button>
        ) : (
          <button onClick={() => onAdd(product)} className="primary-btn shrink-0 px-3 py-2 text-xs sm:text-sm">
            Agregar
          </button>
        )}
      </div>
    </article>
  );
}
