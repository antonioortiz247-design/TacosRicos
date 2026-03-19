'use client';

import { useMemo, useState } from 'react';
import { OrderStatus } from '@/lib/types';

type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
};

const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered'];

export function OrdersPanel({ initialOrders }: { initialOrders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filtered = useMemo(() => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)), [filter, orders]);

  return (
    <section className="space-y-3 rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Pedidos</h2>
        <select className="rounded border p-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as 'all' | OrderStatus)}>
          <option value="all">Todos</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-2 text-sm">
        {filtered.map((order) => (
          <li key={order.id} className="rounded border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">#{order.id} · {order.customer}</p>
                <p className="text-zinc-500">Total: ${order.total}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) =>
                  setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: e.target.value as OrderStatus } : item)))
                }
                className="rounded border p-2"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button className="mt-2 text-xs text-warm-700">Ver detalle</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
