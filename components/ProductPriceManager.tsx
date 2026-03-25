'use client';

import { useState } from 'react';
import { updateProductPrice } from '@/lib/actions';
import { Product } from '@/lib/types';
import { Save, Loader2, DollarSign } from 'lucide-react';

export function ProductPriceManager({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: isNaN(price) ? 0 : price } : p));
  };

  const handleSave = async (id: string, price: number) => {
    setUpdatingId(id);
    try {
      const result = await updateProductPrice(id, price);
      if (result.success) {
        // Podríamos mostrar un toast de éxito aquí
      } else {
        alert('Error al actualizar el precio');
      }
    } catch (error) {
      console.error(error);
      alert('Error inesperado');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <DollarSign size={18} className="text-green-600" />
          Gestión de Precios
        </h2>
        <span className="text-xs text-zinc-500">{products.length} productos</span>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-white text-zinc-500 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium text-right">Precio ($)</th>
              <th className="px-4 py-3 font-medium text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handlePriceChange(product.id, e.target.value)}
                    className="w-20 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-right text-sm focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSave(product.id, product.price)}
                    disabled={updatingId === product.id}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      updatingId === product.id
                        ? 'bg-zinc-100 text-zinc-400'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {updatingId === product.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
