'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import { Plus, Settings2 } from 'lucide-react';

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
    <article className="surface-card group flex flex-col overflow-hidden p-0 sm:flex-row sm:items-center sm:gap-6 sm:pr-6">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-square sm:w-36 sm:rounded-l-none sm:rounded-r-3xl">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 150px"
          />
        ) : (
          <div className="grid h-full place-items-center bg-ink-100/80 text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:bg-white/10 dark:text-ink-300">
            Sin Imagen
          </div>
        )}
        {product.category === 'especialidades' && (
          <div className="absolute left-4 top-4">
            <span className="pill bg-white/70 text-ink-900 shadow-soft backdrop-blur-sm dark:bg-white/10 dark:text-ink-50">Top</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {product.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold tracking-tight text-brand-600 dark:text-brand-500">
              ${product.price}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 sm:mt-4">
          {product.customizable ? (
            <button 
              onClick={() => onCustomize(product)} 
              className="secondary-btn w-full py-2 text-xs sm:w-auto"
            >
              <Settings2 size={14} />
              Personalizar
            </button>
          ) : (
            <button 
              onClick={() => onAdd(product)} 
              className="primary-btn w-full py-2 text-xs sm:w-auto"
            >
              <Plus size={16} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
