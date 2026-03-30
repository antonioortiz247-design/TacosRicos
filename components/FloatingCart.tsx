'use client';

import { useCartStore } from '@/store/cart-store';
import { useState, useEffect } from 'react';
import { ShoppingBag, X, ChevronRight, ShoppingCart } from 'lucide-react';

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
    <div className="fixed bottom-8 right-8 z-50">
      {/* Botón flotante principal */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-soft-xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag size={28} className="transition-transform group-hover:rotate-12" />
            <span className="absolute -right-3 -top-3 flex h-7 w-7 animate-bounce items-center justify-center rounded-full bg-zinc-900 text-[12px] font-black text-white shadow-lg border-2 border-white">
              {itemCount}
            </span>
          </div>
        </button>
      )}

      {/* Mini-resumen expansible con efecto glassmorphism */}
      {isOpen && (
        <div className="glass-effect w-[90vw] max-w-[360px] overflow-hidden rounded-[2.5rem] p-0 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
                <ShoppingCart size={20} className="text-orange-600" />
                Pedido
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Resumen actual</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-zinc-200/50 p-2 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="max-h-[35vh] overflow-y-auto px-6 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-xs font-black text-orange-700">
                    {item.quantity}x
                  </div>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
                    {item.productName}
                  </span>
                </div>
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">${item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="bg-zinc-50/80 px-6 py-6 dark:bg-zinc-900/50">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total a pagar</p>
                <p className="text-3xl font-black tracking-tighter text-orange-600 dark:text-orange-400">${total}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-400 italic">Precios con IVA</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="primary-btn w-full group shadow-orange-500/30"
            >
              Confirmar Pedido
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
