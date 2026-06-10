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
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-8 sm:bottom-8">
      {/* Botón flotante principal */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative ml-auto flex h-14 w-full items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 px-4 text-white shadow-soft-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] sm:h-16 sm:w-16 sm:justify-center sm:rounded-full sm:px-0"
        >
          <div className="flex items-center gap-3 sm:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
              <ShoppingBag size={20} className="transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <div className="text-left">
              <p className="font-display text-sm font-bold">Carrito</p>
              <p className="text-xs text-white/80">{itemCount} items · ${total}</p>
            </div>
          </div>
          <div className="relative hidden sm:block">
            <ShoppingBag size={28} className="transition-transform duration-300 group-hover:rotate-6" />
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-950/55 text-[12px] font-bold text-white shadow-soft border border-white/30 sm:absolute sm:-right-2 sm:-top-2 sm:h-7 sm:w-7 sm:border-2 sm:border-white">
            {itemCount}
          </span>
        </button>
      )}

      {/* Mini-resumen expansible con efecto glassmorphism */}
      {isOpen && (
        <div className="glass-effect mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl p-0 shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between border-b border-white/60 bg-white/60 px-5 py-4 dark:border-white/10 dark:bg-ink-950/35">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900 dark:text-ink-50 flex items-center gap-2">
                <ShoppingCart size={18} className="text-brand-600 dark:text-brand-500" />
                Pedido
              </h3>
              <p className="text-[11px] text-ink-500 dark:text-ink-300">Resumen actual</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-2xl bg-white/60 p-2 text-ink-600 transition-colors hover:bg-white/80 dark:bg-white/10 dark:text-ink-200 dark:hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="max-h-[45vh] space-y-3 overflow-y-auto px-5 py-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70 text-xs font-bold text-brand-700 shadow-soft dark:bg-white/10 dark:text-brand-500">
                    {item.quantity}x
                  </div>
                  <span className="min-w-0 truncate text-sm font-semibold text-ink-900 dark:text-ink-100">
                    {item.productName}
                  </span>
                </div>
                <span className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">${item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/60 px-5 py-5 dark:bg-ink-950/35">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[11px] text-ink-500 dark:text-ink-300">Total</p>
                <p className="font-display text-3xl font-bold tracking-tight text-brand-600 dark:text-brand-500">${total}</p>
              </div>
              <p className="text-xs text-ink-500 dark:text-ink-300">${getSubtotal()} + envío</p>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="primary-btn w-full group"
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
