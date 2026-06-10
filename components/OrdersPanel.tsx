'use client';

import { useEffect, useMemo, useState } from 'react';
import { deleteBusinessOrders, updateOrderStatus } from '@/lib/actions';
import { supabase } from '@/lib/supabase';

type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: AdminOrderStatus;
  created_at: string;
  address?: string;
  address_references?: string;
  delivery_type: string;
  items: any[];
};

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled', 'paid', 'pending_payment'] as const;
type AdminOrderStatus = (typeof statuses)[number];

const statusLabels: Record<AdminOrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'En cocina',
  ready: 'Listo',
  on_the_way: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  paid: 'Pagado',
  pending_payment: 'Pendiente pago'
};

function normalizeOrderStatus(status: string): AdminOrderStatus {
  if (status === 'preparing') return 'preparing';
  if (status === 'confirmed') return 'confirmed';
  if (status === 'ready') return 'ready';
  if (status === 'on_the_way') return 'on_the_way';
  if (status === 'delivered') return 'delivered';
  if (status === 'cancelled' || status === 'canceled') return 'cancelled';
  if (status === 'paid') return 'paid';
  if (status === 'pending_payment' || status === 'payment_pending') return 'pending_payment';
  return 'pending';
}

const PRODUCT_IMAGE_FILE_NAMES: Partial<Record<string, string>> = {
  Barriga: 'TacodeBarriga.jpg',
  Suadero: 'TacodeSuadero.png',
  Pechuga: 'TacodePechuga.jpg',
  Longaniza: 'TacodeLonganiza.jpg',
  'Chile Relleno': 'TacodeChile.jpg',
  Campechanos: 'TacoCampechano.jpg',
  'Chorizo Argentino': 'TacoArgentino.jpg',
  Chuleta: 'TacodeChuleta.jpg',
  Burrito: 'TacodePechuga.png',
  Gringas: 'TacodeSuadero.png'
};

function getProductImageUrl(productName?: string): string | undefined {
  if (!productName) return undefined;
  const fileName = PRODUCT_IMAGE_FILE_NAMES[productName]?.trim();
  if (!fileName) return undefined;
  return fileName.startsWith('/') ? fileName : `/${fileName}`;
}

function getItemImageUrl(item: any): string | undefined {
  const candidate = item?.imageUrl ?? item?.image_url ?? item?.image ?? undefined;
  if (typeof candidate === 'string' && candidate.trim()) return candidate;
  return getProductImageUrl(item?.productName ?? item?.product_name);
}

function mapOrderRow(o: any): OrderRow {
  return {
    id: o.id,
    customer: o.address || 'Cliente',
    total: Number(o.total || 0),
    status: normalizeOrderStatus(o.status),
    created_at: o.created_at,
    address: o.address ?? undefined,
    address_references: o.address_references ?? undefined,
    delivery_type: o.delivery_type,
    items: Array.isArray(o.items) ? o.items : []
  };
}

function sortOrdersDesc(rows: OrderRow[]) {
  return [...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function OrdersPanel({ initialOrders, businessId }: { initialOrders: any[]; businessId?: string }) {
  const [orders, setOrders] = useState<OrderRow[]>(
    sortOrdersDesc(initialOrders.map(mapOrderRow))
  );
  const [filter, setFilter] = useState<'all' | AdminOrderStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)), [filter, orders]);

  useEffect(() => {
    if (!businessId || !supabase?.channel) return;

    const channel = supabase
      .channel(`admin-orders-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const next = payload.new as any | null;
          const previous = payload.old as any | null;

          setOrders((current) => {
            if (payload.eventType === 'DELETE' && previous?.id) {
              return current.filter((order) => order.id !== previous.id);
            }

            if (!next?.id) return current;
            const normalized = mapOrderRow(next);
            const exists = current.some((order) => order.id === normalized.id);
            const merged = exists ? current.map((order) => (order.id === normalized.id ? normalized : order)) : [normalized, ...current];
            return sortOrdersDesc(merged);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

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

  const handleDeleteAll = async () => {
    if (!businessId) {
      alert('No se pudo detectar el negocio para borrar pedidos.');
      return;
    }

    const confirmation = prompt('Para borrar TODOS los pedidos escribe BORRAR');
    if (confirmation !== 'BORRAR') return;

    setIsDeleting(true);
    const result = await deleteBusinessOrders(businessId);
    if (!result.success) {
      alert(result.error || 'No se pudieron borrar los pedidos.');
      setIsDeleting(false);
      return;
    }

    setOrders([]);
    setFilter('all');
    setIsDeleting(false);
  };

  return (
    <section className="space-y-4 rounded-2xl border border-warm-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Gestión de Pedidos</h2>
          <p className="text-sm text-zinc-500">Administra los pedidos entrantes y sus estados</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
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

          <button
            onClick={() => void handleDeleteAll()}
            disabled={isDeleting}
            className="secondary-btn justify-center border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
          >
            {isDeleting ? 'Borrando...' : 'Borrar pedidos'}
          </button>
        </div>
      </div>

      <div className="space-y-3 sm:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-warm-100 bg-warm-50/30 p-5 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/20">
            No hay pedidos que coincidan con el filtro
          </div>
        ) : (
          filtered.map((order) => {
            const time = new Date(order.created_at).toLocaleTimeString();
            const deliveryLabel =
              order.delivery_type === 'delivery' ? 'A domicilio' : order.delivery_type === 'dine_in' ? 'En local' : 'Recoger';
            const addressLabel = order.address || (order.delivery_type === 'dine_in' ? 'En local' : 'Para recoger');
            const thumbnails = order.items
              .map((item) => getItemImageUrl(item))
              .filter(Boolean)
              .slice(0, 4) as string[];

            return (
              <article key={order.id} className="rounded-2xl border border-warm-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-400">#{order.id.slice(0, 8)}</span>
                      <span className="text-xs font-medium text-zinc-500">{time}</span>
                    </div>
                    <p className="mt-2 truncate text-sm font-black text-zinc-900 dark:text-zinc-100">{addressLabel}</p>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-zinc-500">{deliveryLabel}</p>
                    {order.address_references ? (
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">{order.address_references}</p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-right text-lg font-black text-warm-700 dark:text-warm-400">${order.total}</p>
                </div>

                {thumbnails.length > 0 ? (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {thumbnails.map((src, idx) => (
                      <img
                        key={`${order.id}-thumb-${idx}`}
                        src={src}
                        alt="Producto"
                        className="h-10 w-10 shrink-0 rounded-xl border border-warm-100 object-cover dark:border-zinc-800"
                      />
                    ))}
                    {order.items.length > thumbnails.length ? (
                      <span className="pill bg-warm-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">+{order.items.length - thumbnails.length}</span>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-4">
                  <select
                    disabled={updatingId === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrderStatus)}
                    className={`w-full rounded-lg border p-3 text-sm font-black transition-colors ${
                      updatingId === order.id ? 'opacity-50' : ''
                    } ${
                      order.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                      order.status === 'confirmed' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                      order.status === 'pending_payment' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                      order.status === 'preparing' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                      order.status === 'ready' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                      order.status === 'on_the_way' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' :
                      order.status === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                      order.status === 'paid' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                      'border-rose-200 bg-rose-50 text-rose-700'
                    }`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{statusLabels[status]}</option>
                    ))}
                  </select>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-warm-100 dark:border-zinc-800 sm:block">
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
                    <p className="font-medium">{order.address || (order.delivery_type === 'dine_in' ? 'En local' : 'Para recoger')}</p>
                    <p className="text-xs text-zinc-500 uppercase">{order.delivery_type === 'delivery' ? 'A domicilio' : order.delivery_type === 'dine_in' ? 'En local' : 'Recoger'}</p>
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
                        order.status === 'confirmed' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                        order.status === 'pending_payment' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                        order.status === 'preparing' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                        order.status === 'ready' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                        order.status === 'on_the_way' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' :
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
