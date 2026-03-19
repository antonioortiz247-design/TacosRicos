'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { buildWhatsAppOrderMessage, getWhatsAppLink } from '@/lib/whatsapp';
import { useCartStore } from '@/store/cart-store';

export function Cart({ waPhone, businessName }: { waPhone: string; businessName: string }) {
  const { items, removeItem, getSubtotal, getTotal, getDeliveryFee, deliveryType, address, references, paymentMethod } = useCartStore();
  const searchParams = useSearchParams();

  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>('pending');
  const [paymentError, setPaymentError] = useState('');

  const subtotal = getSubtotal();
  const total = getTotal();
  const deliveryFee = getDeliveryFee();
  const isCardPayment = paymentMethod === 'card';
  const canSendToWhatsApp = !isCardPayment || paymentStatus === 'paid';

  useEffect(() => {
    if (!isCardPayment) return;

    const paymentIdFromUrl = searchParams.get('payment_id') || searchParams.get('collection_id') || '';
    const collectionStatus = searchParams.get('collection_status') || searchParams.get('status') || '';

    if (paymentIdFromUrl) {
      void confirmCardPayment(paymentIdFromUrl);
      return;
    }

    if (collectionStatus === 'approved') setPaymentStatus('paid');
    if (collectionStatus === 'rejected') setPaymentStatus('failed');
  }, [isCardPayment, searchParams]);

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
        paymentMethod,
        paymentStatus: isCardPayment ? paymentStatus : undefined
      }),
    [address, businessName, deliveryFee, deliveryType, isCardPayment, items, paymentMethod, paymentStatus, references, subtotal, total]
  );

  const link = getWhatsAppLink(waPhone, message);

  const startCardPayment = async () => {
    if (total <= 0 || items.length === 0) {
      setPaymentError('Agrega productos al carrito antes de pagar.');
      return;
    }

    setIsCreatingPayment(true);
    setPaymentError('');

    try {
      const origin = window.location.origin;
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          total,
          items,
          successUrl: `${origin}/${businessName}/menu?payment=success`,
          failureUrl: `${origin}/${businessName}/menu?payment=failure`,
          pendingUrl: `${origin}/${businessName}/menu?payment=pending`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const details = typeof data?.error === 'string' ? data.error : JSON.stringify(data?.error ?? {});
        throw new Error(`No se pudo crear la preferencia de pago. ${details}`);
      }

      const checkoutUrl = data.init_point || data.sandbox_init_point;
      if (!checkoutUrl) throw new Error('Mercado Pago no devolvió URL de checkout.');

      window.location.assign(checkoutUrl);
    } catch (error) {
      setPaymentStatus('failed');
      setPaymentError(error instanceof Error ? error.message : 'No se pudo abrir checkout de Mercado Pago.');
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const confirmCardPayment = async (paymentId: string) => {
    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });

    const data = await response.json();
    if (!response.ok) {
      setPaymentStatus('failed');
      setPaymentError('No se pudo confirmar el pago automáticamente.');
      return;
    }

    setPaymentStatus(data.payment_status);
    if (data.payment_status !== 'paid') {
      setPaymentError('Tu pago aún no está aprobado en Mercado Pago.');
    }
  };

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

      {isCardPayment ? (
        <div className="space-y-2 rounded-lg border border-warm-200 p-3">
          <p className="text-sm font-semibold">Pago con tarjeta (Mercado Pago)</p>
          <button
            onClick={startCardPayment}
            disabled={isCreatingPayment}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isCreatingPayment ? 'Abriendo checkout...' : 'Pagar con tarjeta'}
          </button>
          <p className="text-xs">
            Estado de pago: <b>{paymentStatus}</b>
          </p>
          {paymentStatus === 'paid' ? <p className="text-xs text-emerald-600">Pago confirmado. Ya puedes enviar tu pedido por WhatsApp.</p> : null}
          {paymentError ? <p className="text-xs text-red-600">{paymentError}</p> : null}
        </div>
      ) : null}

      <a
        href={canSendToWhatsApp ? link : '#'}
        className={`block rounded-lg px-3 py-2 text-center text-sm font-semibold text-white ${canSendToWhatsApp ? 'bg-green-600' : 'bg-zinc-400'}`}
      >
        Enviar por WhatsApp
      </a>
      {isCardPayment && paymentStatus !== 'paid' ? <p className="text-xs text-amber-600">Primero completa el pago con tarjeta.</p> : null}
    </aside>
  );
}
