import { supabase } from './supabase';

export const SALES_QUERY_SQL = 'SELECT SUM(total) FROM orders WHERE DATE(created_at)=CURRENT_DATE;';
export const ORDERS_QUERY_SQL = 'SELECT COUNT(*) FROM orders WHERE DATE(created_at)=CURRENT_DATE;';

export async function getOwnerDashboardMetrics(businessId: string) {
  const today = new Date().toISOString().slice(0, 10);

  const [salesResult, ordersResult, topResult, recentResult] = await Promise.all([
    supabase.from('orders').select('total').eq('business_id', businessId).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`),
    supabase.from('order_items').select('product_name').limit(200),
    supabase.from('orders').select('id,total,status,created_at').eq('business_id', businessId).order('created_at', { ascending: false }).limit(5)
  ]);

  const totalSales = (salesResult.data ?? []).reduce((sum, row) => sum + Number(row.total || 0), 0);
  const ordersCount = ordersResult.count ?? 0;
  const avgTicket = ordersCount > 0 ? Number((totalSales / ordersCount).toFixed(2)) : 0;

  const frequencies = (topResult.data ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.product_name] = (acc[row.product_name] ?? 0) + 1;
    return acc;
  }, {});

  const topProducts = Object.entries(frequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)
    .join(', ') || 'Sin datos';

  return {
    sales: totalSales,
    orders: ordersCount,
    avgTicket,
    topProducts,
    recentOrders: recentResult.data ?? []
  };
}
