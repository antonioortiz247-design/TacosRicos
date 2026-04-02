'use client';

import { useMemo, useState } from 'react';
import { updateOrderStatus } from '@/lib/actions';

type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: AdminOrderStatus;
  created_at: string;
  address?: string;
  delivery_type: string;
};

const statuses = ['pending', 'delivered', 'cancelled', 'paid', 'pending_payment'] as const;
type AdminOrderStatus = (typeof statuses)[number];

const statusLabels: Record<AdminOrderStatus, string> = {
  pending: 'Pendiente',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  paid: 'Pagado',
  pending_payment: 'Pendiente pago'
};

function normalizeOrderStatus(status: string): AdminOrderStatus {
  if (status === 'delivered') return 'delivered';
  if (status === 'cancelled' || status === 'canceled') return 'cancelled';
  if (status === 'paid') return 'paid';
  if (status === 'pending_payment' || status === 'payment_pending') return 'pending_payment';
  return 'pending';
}

export function OrdersPanel({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<OrderRow[]>(
    initialOrders.map(o => ({
      id: o.id,
      customer: o.address || 'Cliente',
      total: o.total,
      status: normalizeOrderStatus(o.status),
      created_at: o.created_at,
      address: o.address,
      delivery_type: o.delivery_type
    }))
  );
  const [filter, setFilter] = useState<'all' | AdminOrderStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)), [filter, orders]);

  const handleStatusChange = async (orderId: string, newStatus: AdminOrderStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert('Error al actualizar el estado: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-warm-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Gestión de Pedidos</h2>
          <p className="text-sm text-zinc-500">Administra los pedidos entrantes y sus estados</p>
        </div>
        <select 
          className="rounded-lg border border-warm-200 bg-warm-50 p-2 text-sm focus:border-warm-500 focus:ring-warm-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as 'all' | AdminOrderStatus)}
        >
          <option value="all">Todos los estados</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-warm-100 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-warm-50 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Pedido</th>
              <th className="px-4 py-3 font-semibold">Cliente/Dirección</th>
              <th className="px-4 py-3 font-semibold text-right">Total</th>
              <th className="px-4 py-3 font-semibold text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-50 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 italic">
                  No hay pedidos que coincidan con el filtro
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-warm-50/50 dark:hover:bg-zinc-800/30">
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-zinc-400">#{order.id.slice(0, 8)}</span>
                    <p className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{order.address || 'Para recoger'}</p>
                    <p className="text-xs text-zinc-500 uppercase">{order.delivery_type === 'delivery' ? 'A domicilio' : 'Recoger'}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-warm-700 dark:text-warm-400">
                    ${order.total}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      disabled={updatingId === order.id}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrderStatus)}
                      className={`w-full rounded-lg border p-2 text-xs font-medium transition-colors ${
                        updatingId === order.id ? 'opacity-50' : ''
                      } ${
                        order.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                        order.status === 'pending_payment' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                        order.status === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                        order.status === 'paid' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                        'border-rose-200 bg-rose-50 text-rose-700'
                      }`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{statusLabels[status]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
