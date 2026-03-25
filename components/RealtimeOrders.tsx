'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  total: number;
  status: string;
  created_at?: string;
};

export function RealtimeOrders({ initialOrders, businessId }: { initialOrders: Order[], businessId: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev].slice(0, 10));
          
          // Notificación sonora opcional
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¡Nuevo Pedido!', { body: `Orden por $${newOrder.total}` });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  return (
    <section className="rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Pedidos Recientes (En vivo)</h2>
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
      </div>
      <ul className="mt-3 space-y-2">
        {orders.length === 0 ? (
          <p className="text-zinc-500 text-center py-4">No hay pedidos recientes</p>
        ) : (
          orders.map((row) => (
            <li key={row.id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-zinc-500">#{row.id.slice(0, 8)}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">${row.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`pill ${
                  row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  row.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {row.status}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
