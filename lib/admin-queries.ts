import { getSupabaseClient } from './supabase';

export const SALES_QUERY_SQL = 'SELECT SUM(total) FROM orders WHERE DATE(created_at)=CURRENT_DATE;';
export const ORDERS_QUERY_SQL = 'SELECT COUNT(*) FROM orders WHERE DATE(created_at)=CURRENT_DATE;';

function mapProductRow(row: any) {
  return {
    id: row.id,
    businessId: row.business_id,
    category: row.category,
    name: row.name,
    description: row.description || undefined,
    price: Number(row.price || 0),
    imageUrl: row.image_url || undefined,
    active: row.active,
    customizable: row.customizable,
    stock: row.stock
  };
}

export async function resolveBusinessId(input: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const normalized = input.trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized);

  if (normalized && isUUID) {
    return normalized;
  }

  if (normalized) {
    const { data: bizBySlug } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', normalized)
      .maybeSingle();

    if (bizBySlug?.id) {
      return bizBySlug.id as string;
    }
  }

  const { data: firstBusiness } = await supabase
    .from('businesses')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return firstBusiness?.id ?? null;
}

export async function getBusinessBySlug(slug: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase client not available in getBusinessBySlug');
    return null;
  }
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching business by slug:', error);
    return null;
  }
  return data;
}

export async function getBusinessProducts(businessId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase client not available in getBusinessProducts');
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .eq('active', true);
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data ?? []).map(mapProductRow);
}

export async function getBusinessSettings(businessId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('business_id', businessId)
    .single();
  
  if (error) return null;
  return data;
}

export async function getBusinessOrders(businessId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const resolvedBusinessId = await resolveBusinessId(businessId);
  if (!resolvedBusinessId) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('business_id', resolvedBusinessId)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data;
}
