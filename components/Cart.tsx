'use client';

import { buildWhatsAppOrderMessage, getWhatsAppLink } from '@/lib/whatsapp';
import { useCartStore } from '@/store/cart-store';

export function Cart({ waPhone, businessName }: { waPhone: string; businessName: string }) {
  const { items, removeItem, getSubtotal, getTotal, deliveryType, address, paymentMethod, minOrder } = useCartStore();

  const total = getTotal();
  const canOrder = getSubtotal() >= minOrder;
  const message = buildWhatsAppOrderMessage({ businessName, items, total, deliveryType, address, paymentMethod });
  const link = getWhatsAppLink(waPhone, message);

  return (
    <aside className="space-y-3 rounded-xl border border-warm-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold">Carrito</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border p-2">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-zinc-500">{item.config.tortilla} · {item.config.extras.join(', ') || 'sin extras'}</p>
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
      <p className="font-bold">Total: ${total}</p>
      {!canOrder ? <p className="text-xs text-red-600">Pedido mínimo: ${minOrder}</p> : null}
      <a
        href={canOrder ? link : '#'}
        className={`block rounded-lg px-3 py-2 text-center text-sm font-semibold text-white ${canOrder ? 'bg-green-600' : 'bg-zinc-400'}`}
      >
        Enviar por WhatsApp
      </a>
    </aside>
  );
}
