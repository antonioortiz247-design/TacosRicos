import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { getConfiguredBusinessIdentifier } from '@/lib/business-config';
import { resolveBusinessId } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const hasAdminSession = cookie.includes('admin_session=1');

  if (!hasAdminSession) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, salesToday: 0, ordersToday: 0, avgTicket: 0 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const { searchParams } = new URL(request.url);
  const requestedBusiness = (searchParams.get('negocio') || '').trim();
  const businessId = await resolveBusinessId(requestedBusiness || getConfiguredBusinessIdentifier());

  if (!businessId) {
    return NextResponse.json({ ok: true, salesToday: 0, ordersToday: 0, avgTicket: 0 });
  }

  const [salesResult, ordersResult] = await Promise.all([
    supabase.from('orders').select('total').eq('business_id', businessId).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`)
  ]);

  if (salesResult.error || ordersResult.error) {
    return NextResponse.json({ ok: false, error: salesResult.error ?? ordersResult.error }, { status: 400 });
  }

  const salesToday = (salesResult.data ?? []).reduce((sum, row) => sum + Number(row.total || 0), 0);
  const ordersToday = ordersResult.count ?? 0;
  const avgTicket = ordersToday > 0 ? Number((salesToday / ordersToday).toFixed(2)) : 0;

  return NextResponse.json({ ok: true, salesToday, ordersToday, avgTicket });
}
