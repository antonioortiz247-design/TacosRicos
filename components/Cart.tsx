'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildWhatsAppOrderMessage, getWhatsAppLink } from '@/lib/whatsapp';
import { useCartStore } from '@/store/cart-store';

const OPENING_MINUTE = 9 * 60 + 30; // 09:30
const CLOSING_MINUTE = 15 * 60; // 15:00

function isWithinOrderSchedule(date: Date): boolean {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= OPENING_MINUTE && minutes <= CLOSING_MINUTE;
}

export function Cart({ waPhone, businessName }: { waPhone: string; businessName: string }) {
  const { items, removeItem, getSubtotal, getTotal, getDeliveryFee, deliveryType, address, references, paymentMethod } = useCartStore();
  const [isOrderTime, setIsOrderTime] = useState(true);

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
    const updateSchedule = () => setIsOrderTime(isWithinOrderSchedule(new Date()));
    updateSchedule();
    const intervalId = window.setInterval(updateSchedule, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <aside className="space-y-3 rounded-xl border border-warm-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold">Carrito</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border p-2">
            <div>
              <p className="font-medium">{item.productName}</p>
              {item.config ? (
                <p className="text-zinc-500">{item.config.tortilla} · {item.config.extras.join(', ') || 'sin extras'}</p>
              ) : (
                <p className="text-zinc-500">Producto estándar</p>
              )}
            </div>
            <div className="text-right">
              <p>${item.subtotal}</p>
              <button className="text-xs text-red-500" onClick={() => removeItem(item.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="rounded-lg bg-zinc-50 p-2 text-sm dark:bg-zinc-800">
        <p>Subtotal: ${subtotal}</p>
        <p>Envío: ${deliveryFee}</p>
        <p className="font-bold">Total: ${total}</p>
      </div>

      <a
        href={isOrderTime ? link : '#'}
        className={`block rounded-lg px-3 py-2 text-center text-sm font-semibold text-white ${isOrderTime ? 'bg-green-600' : 'bg-zinc-400'}`}
      >
        Enviar por WhatsApp
      </a>
      {!isOrderTime ? <p className="text-xs text-amber-600">Los pedidos solo están disponibles de 9:30 a 15:00 horas.</p> : null}
    </aside>
  );
}
