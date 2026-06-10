'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildWhatsAppOrderMessage, getWhatsAppLink } from '@/lib/whatsapp';
import { useCartStore } from '@/store/cart-store';
import { createOrder } from '@/lib/actions';

const OPENING_MINUTE = 9 * 60 + 30; // 09:30
const CLOSING_MINUTE = 15 * 60; // 15:00

function isWithinOrderSchedule(date: Date): boolean {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= OPENING_MINUTE && minutes <= CLOSING_MINUTE;
}

export function Cart({ waPhone, businessName, businessId }: { waPhone: string; businessName: string; businessId: string }) {
  const { items, removeItem, getSubtotal, getTotal, getDeliveryFee, deliveryType, address, address_references, paymentMethod, clearCart } = useCartStore();
  const [isOrderTime, setIsOrderTime] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const subtotal = getSubtotal();
  const total = getTotal();
  const deliveryFee = getDeliveryFee();

  const message = useMemo(
    () =>
      buildWhatsAppOrderMessage({
        businessName,
        items,
        total,
        subtotal,
        deliveryFee,
        deliveryType,
        address,
        address_references,
        paymentMethod
      }),
    [address, businessName, deliveryFee, deliveryType, items, paymentMethod, address_references, subtotal, total]
  );

  const link = getWhatsAppLink(waPhone, message);
  const isDineIn = deliveryType === 'dine_in';
  const needsLocalReference = isDineIn && address.trim().length === 0;

  useEffect(() => {
    // Forzado a true para permitir pruebas fuera de horario
    const updateSchedule = () => setIsOrderTime(true);
    updateSchedule();
    const intervalId = window.setInterval(updateSchedule, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleOrder = async (e: React.MouseEvent) => {
    if (!isOrderTime || items.length === 0 || needsLocalReference) return;
    
    setIsSubmitting(true);
    try {
      const result = await createOrder({
        businessId,
        items,
        total,
        deliveryType,
        address,
        address_references,
        paymentMethod
      });

      if (result.success) {
        if (isDineIn) {
          setToast({ kind: 'success', message: 'Pedido enviado a cocina.' });
          clearCart();
        } else {
          // Una vez guardado en la DB, abrimos WhatsApp
          window.open(link, '_blank');
        }
      } else {
        setToast({ kind: 'error', message: result.error || 'No se pudo procesar tu pedido. Intenta de nuevo.' });
      }
    } catch (error) {
      console.error('Error handling order:', error);
      setToast({ kind: 'error', message: 'Error inesperado. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="surface-card space-y-3">
      {toast ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-soft backdrop-blur ${
            toast.kind === 'success'
              ? 'border-accent-500/20 bg-accent-500/10 text-ink-900 dark:text-ink-50'
              : 'border-rose-500/20 bg-rose-500/10 text-ink-900 dark:text-ink-50'
          }`}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-xs font-bold text-ink-600 hover:underline dark:text-ink-200">
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <h3 className="section-title">Carrito</h3>
        <span className="pill">{items.length} items</span>
      </div>

      <ul className="max-h-72 space-y-2 overflow-auto pr-1 text-sm">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-white/60 bg-white/60 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display font-bold text-ink-900 dark:text-ink-50">{item.productName}</p>
                {item.config ? (
                  <p className="text-xs text-ink-600 dark:text-ink-300">
                    {item.config.protein
                      ? item.config.protein
                      : `${item.config.tortilla} · ${item.config.extras.join(', ') || 'sin extras'}`}
                  </p>
                ) : (
                  <p className="text-xs text-ink-600 dark:text-ink-300">Producto estándar</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-ink-900 dark:text-ink-50">${item.subtotal}</p>
                <button className="text-xs font-bold text-rose-600 transition hover:underline" onClick={() => removeItem(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-white/60 bg-white/60 p-4 text-sm shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
        <p className="flex justify-between"><span>Subtotal:</span><span>${subtotal}</span></p>
        <p className="flex justify-between"><span>Envío:</span><span>${deliveryFee}</span></p>
        <p className="mt-2 flex justify-between font-display text-base font-bold text-ink-900 dark:text-ink-50"><span>Total:</span><span className="text-brand-600 dark:text-brand-500">${total}</span></p>
      </div>

      <button
        onClick={handleOrder}
        disabled={!isOrderTime || isSubmitting || items.length === 0 || needsLocalReference}
        className={`primary-btn w-full ${isOrderTime && items.length > 0 && !needsLocalReference ? '' : 'pointer-events-none opacity-50'} ${isSubmitting ? 'animate-pulse opacity-70' : ''}`}
      >
        {isSubmitting ? 'Procesando...' : isDineIn ? 'Enviar a cocina' : 'Enviar por WhatsApp'}
      </button>
      {!isOrderTime ? <p className="text-xs text-amber-600">Los pedidos solo están disponibles de 9:30 a 15:00 horas.</p> : null}
      {needsLocalReference ? <p className="text-xs text-amber-600">Indica la mesa, barra o nombre para enviar el pedido a cocina.</p> : null}
    </aside>
  );
}
