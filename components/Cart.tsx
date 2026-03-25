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
  const { items, removeItem, getSubtotal, getTotal, getDeliveryFee, deliveryType, address, references, paymentMethod, clearCart } = useCartStore();
  const [isOrderTime, setIsOrderTime] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        references,
        paymentMethod
      }),
    [address, businessName, deliveryFee, deliveryType, items, paymentMethod, references, subtotal, total]
  );

  const link = getWhatsAppLink(waPhone, message);

  useEffect(() => {
    // Forzado a true para permitir pruebas fuera de horario
    const updateSchedule = () => setIsOrderTime(true);
    updateSchedule();
    const intervalId = window.setInterval(updateSchedule, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleOrder = async (e: React.MouseEvent) => {
    if (!isOrderTime || items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const result = await createOrder({
        businessId,
        items,
        total,
        deliveryType,
        address,
        references,
        paymentMethod
      });

      if (result.success) {
        // Una vez guardado en la DB, abrimos WhatsApp
        window.open(link, '_blank');
        // Opcionalmente limpiamos el carrito
        // clearCart();
      } else {
        alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error handling order:', error);
      alert('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="surface-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Carrito</h3>
        <span className="pill bg-amber-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">{items.length} items</span>
      </div>

      <ul className="max-h-72 space-y-2 overflow-auto pr-1 text-sm">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-white/60 p-2.5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{item.productName}</p>
                {item.config ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.config.protein
                      ? item.config.protein
                      : `${item.config.tortilla} · ${item.config.extras.join(', ') || 'sin extras'}`}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">Producto estándar</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-700 dark:text-slate-200">${item.subtotal}</p>
                <button className="text-xs text-rose-600 transition hover:text-rose-700" onClick={() => removeItem(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/80">
        <p className="flex justify-between"><span>Subtotal:</span><span>${subtotal}</span></p>
        <p className="flex justify-between"><span>Envío:</span><span>${deliveryFee}</span></p>
        <p className="mt-1 flex justify-between text-base font-bold text-slate-900 dark:text-slate-100"><span>Total:</span><span>${total}</span></p>
      </div>

      <button
        onClick={handleOrder}
        disabled={!isOrderTime || isSubmitting || items.length === 0}
        className={`primary-btn w-full ${isOrderTime && items.length > 0 ? '' : 'pointer-events-none bg-slate-400 hover:bg-slate-400'} ${isSubmitting ? 'animate-pulse opacity-70' : ''}`}
      >
        {isSubmitting ? 'Procesando...' : 'Enviar por WhatsApp'}
      </button>
      {!isOrderTime ? <p className="text-xs text-amber-600">Los pedidos solo están disponibles de 9:30 a 15:00 horas.</p> : null}
    </aside>
  );
}
