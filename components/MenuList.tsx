'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { CustomizationModal } from './CustomizationModal';
import { useCartStore } from '@/store/cart-store';

const sectionTitles: Record<Product['category'], string> = {
  tacos: '🌮 Tacos',
  especialidades: '🌯 Especialidades',
  viernes: '🍤 Viernes',
  miercoles: '🥔 Miércoles',
  jueves: '🐟 Jueves'
};

export function MenuList({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const byCategory = Object.keys(sectionTitles).map((key) => ({
    key: key as Product['category'],
    label: sectionTitles[key as Product['category']],
    items: products.filter((product) => product.active && product.category === key)
  }));

  return (
    <div className="space-y-6">
      {byCategory.map((group) => (
        <section key={group.key} className="space-y-3">
          <h2 className="text-lg font-bold">{group.label}</h2>
          {group.items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCustomize={setSelected}
              onAdd={(item) =>
                addItem({
                  id: crypto.randomUUID(),
                  productId: item.id,
                  productName: item.name,
                  quantity: 1,
                  unitPrice: item.price,
                  subtotal: item.price
                })
              }
            />
          ))}
        </section>
      ))}

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
    </div>
  );
}
