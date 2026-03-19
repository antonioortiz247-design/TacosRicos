'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { CustomizationModal } from './CustomizationModal';
import { useCartStore } from '@/store/cart-store';

export function MenuList({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <>
      <div className="space-y-3">
        {products.filter((product) => product.active).map((product) => (
          <ProductCard key={product.id} product={product} onCustomize={setSelected} />
        ))}
      </div>
      {selected ? (
        <CustomizationModal
          product={selected}
          onClose={() => setSelected(null)}
          onConfirm={(config, unitPrice) => {
            addItem({
              id: crypto.randomUUID(),
              productId: selected.id,
              productName: selected.name,
              quantity: 1,
              config,
              unitPrice,
              subtotal: unitPrice
            });
            setSelected(null);
          }}
        />
      ) : null}
    </>
  );
}
