'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { updateOrderStatus } from '@/lib/actions';
import { supabase } from '@/lib/supabase';
import { KitchenOrder } from '@/lib/admin-queries';

const visibleStatuses = ['pending', 'confirmed', 'preparing', 'ready'];

const statusLabels: Record<string, string> = {
  pending: 'Nuevo',
  confirmed: 'Confirmado',
  preparing: 'En cocina',
  ready: 'Listo',
  delivered: 'Surtido',
  cancelled: 'Cancelado'
};

function formatTime(value?: string) {
  if (!value) return '--:--';
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function getItemConfig(item: any) {
  if (!item?.config) return 'Estándar';
  if (item.config.protein) return item.config.protein;

  const extras = Array.isArray(item.config.extras) && item.config.extras.length > 0 ? item.config.extras.join(', ') : 'sin extras';
  const notes = item.config.notes ? ` · nota: ${item.config.notes}` : '';
  return `${item.config.tortilla ?? 'maíz'} · ${extras}${notes}`;
}

function sortOrders(orders: KitchenOrder[]) {
  return [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function KitchenOrdersPanel({ initialOrders, businessId }: { initialOrders: KitchenOrder[]; businessId: string }) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase?.channel || !businessId) return;

    const channel = supabase
      .channel(`kitchen-orders-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const next = payload.new as KitchenOrder | null;
          const previous = payload.old as KitchenOrder | null;

          setOrders((current) => {
            if (payload.eventType === 'DELETE' && previous?.id) {
              return current.filter((order) => order.id !== previous.id);
            }

            if (!next?.id) return current;

            const shouldShow = next.delivery_type === 'dine_in' && visibleStatuses.includes(next.status);
            const normalized = {
              ...next,
              total: Number(next.total || 0),
              items: Array.isArray(next.items) ? next.items : []
            };

            if (!shouldShow) {
              return current.filter((order) => order.id !== next.id);
            }

            const exists = current.some((order) => order.id === next.id);
            const merged = exists ? current.map((order) => (order.id === next.id ? normalized : order)) : [...current, normalized];
            return sortOrders(merged);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const grouped = useMemo(
    () => ({
      active: orders.filter((order) => order.status !== 'ready'),
      ready: orders.filter((order) => order.status === 'ready')
    }),
    [orders]
  );

  const handleStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    const result = await updateOrderStatus(orderId, status);

    if (result.success) {
      setOrders((current) => {
        if (!visibleStatuses.includes(status)) return current.filter((order) => order.id !== orderId);
        return current.map((order) => (order.id === orderId ? { ...order, status } : order));
      });
    } else {
      alert(result.error || 'No se pudo actualizar el pedido.');
    }

    setUpdatingId(null);
  };

  const renderOrder = (order: KitchenOrder) => (
    <article key={order.id} className="surface-card border-orange-100/80 p-4 shadow-sm dark:border-orange-500/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">
              {statusLabels[order.status] ?? order.status}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-zinc-500">
              <Clock size={13} /> {formatTime(order.created_at)}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            {order.address || 'Pedido en local'}
          </h3>
          {order.address_references ? <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">{order.address_references}</p> : null}
        </div>
        <p className="text-right text-lg font-black text-orange-600 dark:text-orange-400">${order.total}</p>
      </div>

      <ul className="mt-4 space-y-2">
        {order.items.map((item: any, index: number) => (
          <li key={`${order.id}-${item.id ?? index}`} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-zinc-900 dark:text-zinc-100">
                  {item.quantity ?? 1}× {item.productName ?? item.product_name ?? 'Producto'}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{getItemConfig(item)}</p>
              </div>
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">${item.subtotal ?? item.unitPrice ?? 0}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          onClick={() => handleStatus(order.id, 'preparing')}
          disabled={updatingId === order.id || order.status === 'preparing'}
          className="secondary-btn justify-center py-2 text-xs disabled:opacity-50"
        >
          <ChefHat size={15} /> En cocina
        </button>
        <button
          onClick={() => handleStatus(order.id, 'ready')}
          disabled={updatingId === order.id || order.status === 'ready'}
          className="secondary-btn justify-center py-2 text-xs disabled:opacity-50"
        >
          <CheckCircle2 size={15} /> Listo
        </button>
        <button
          onClick={() => handleStatus(order.id, 'delivered')}
          disabled={updatingId === order.id}
          className="primary-btn justify-center py-2 text-xs disabled:opacity-50"
        >
          Surtido
        </button>
      </div>
    </article>
  );

  return (
    <section className="space-y-5">
      <div className="surface-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Cocina · Pedidos en local</h2>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Aquí aparecen los pedidos marcados como “En local” para prepararlos y surtirlos.</p>
        </div>
        <span className="pill bg-amber-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">
          {orders.length} activos
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <ChefHat className="mx-auto text-orange-500" size={40} />
          <h3 className="mt-3 text-lg font-black text-zinc-900 dark:text-zinc-100">Sin pedidos para cocina</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Cuando se envíe un pedido en local aparecerá automáticamente aquí.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
          <div className="space-y-4">
            <h3 className="section-title">Por preparar</h3>
            {grouped.active.length > 0 ? grouped.active.map(renderOrder) : <p className="surface-card p-4 text-sm text-zinc-500">No hay pedidos pendientes.</p>}
          </div>
          <div className="space-y-4">
            <h3 className="section-title">Listos para surtir</h3>
            {grouped.ready.length > 0 ? grouped.ready.map(renderOrder) : <p className="surface-card p-4 text-sm text-zinc-500">No hay pedidos listos.</p>}
          </div>
        </div>
      )}
    </section>
  );
}
