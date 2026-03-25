'use client';

import { useCartStore } from '@/store/cart-store';
import { useState, useEffect } from 'react';
import { ShoppingBag, X, ChevronRight } from 'lucide-react';

export function FloatingCart() {
  const { items, getTotal, getSubtotal } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar errores de hidratación en Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || items.length === 0) return null;

  const total = getTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Botón flotante principal */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-2xl transition-transform active:scale-95 hover:bg-orange-700"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-orange-600 shadow-sm">
              {itemCount}
            </span>
          </div>
        </button>
      )}

      {/* Mini-resumen expansible (opcional, podrías ir directo al modal/sidebar) */}
      {isOpen && (
        <div className="surface-card w-[90vw] max-w-[320px] overflow-hidden rounded-2xl p-0 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-orange-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-orange-900/10">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShoppingBag size={18} className="text-orange-600" />
              Tu Carrito
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="max-h-[40vh] overflow-y-auto px-4 py-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  {item.quantity}x {item.productName}
                </span>
                <span className="font-medium">${item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">Total estimado</span>
              <span className="text-lg font-bold text-orange-600">${total}</span>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                // Aquí podrías hacer scroll al componente Cart principal
                document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="primary-btn w-full flex items-center justify-center gap-2"
            >
              Ver detalles y pedir
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
