import { getSupabaseClient } from './supabase';

export const SALES_QUERY_SQL = 'SELECT SUM(total) FROM orders WHERE DATE(created_at)=CURRENT_DATE;';
export const ORDERS_QUERY_SQL = 'SELECT COUNT(*) FROM orders WHERE DATE(created_at)=CURRENT_DATE;';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mapProductRow(row: any) {
  return {
    id: row.id,
    businessId: row.business_id,
    category: row.category,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    imageUrl: row.image_url ?? undefined,
    active: Boolean(row.active),
    customizable: row.customizable ?? true,
    stock: row.stock ?? undefined
  };
}

export async function resolveBusinessId(businessIdOrSlug?: string | null): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !businessIdOrSlug) return null;

  if (UUID_REGEX.test(businessIdOrSlug)) {
    return businessIdOrSlug;
  }

  const { data: biz, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', businessIdOrSlug)
    .maybeSingle();

  if (error) {
    console.error('Error resolving business slug:', error);
    return null;
  }

  return biz?.id ?? null;
}

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

export async function getOwnerDashboardMetrics(businessIdOrSlug: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      sales: 0,
      orders: 0,
      avgTicket: 0,
      topProducts: 'Sin datos',
      recentOrders: [] as Array<{ id: string; total: number; status: string; created_at: string }>,
      products: [] as any[],
      businessName: 'No conectado',
      businessId: ''
    };
  }

  let businessId = businessIdOrSlug;

  // Si no es un UUID válido, intentamos buscarlo como slug
  const isUUID = UUID_REGEX.test(businessIdOrSlug);
  
  if (!isUUID && businessIdOrSlug) {
    console.log(`Buscando negocio por slug: ${businessIdOrSlug}`);
    const { data: biz, error: bizError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('slug', businessIdOrSlug)
      .single();
    
    if (bizError) {
      console.error('Error al buscar negocio por slug:', bizError);
    }

    if (biz) {
      businessId = biz.id;
      console.log(`Negocio encontrado: ${biz.name} (${biz.id})`);
    } else {
      // Si no se encuentra por slug, intentamos buscar el primer negocio disponible como fallback
      console.warn(`No se encontró negocio para el slug: ${businessIdOrSlug}. Intentando obtener el primer negocio...`);
      const { data: allBiz } = await supabase.from('businesses').select('id, name').limit(1);
      if (allBiz && allBiz.length > 0) {
        businessId = allBiz[0].id;
        console.log(`Usando negocio fallback: ${allBiz[0].name} (${allBiz[0].id})`);
      } else {
        return {
          sales: 0,
          orders: 0,
          avgTicket: 0,
          topProducts: 'Negocio no encontrado',
          recentOrders: [],
          products: [],
          businessName: 'No configurado'
        };
      }
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const [salesResult, ordersResult, topResult, recentResult, productsResult] = await Promise.all([
    supabase.from('orders').select('total').eq('business_id', businessId).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`),
    supabase.from('order_items').select('product_name, orders!inner(business_id)').eq('orders.business_id', businessId).limit(200),
    supabase.from('orders').select('id,total,status,created_at').eq('business_id', businessId).order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('*').eq('business_id', businessId).order('name')
  ]);

  if (productsResult.error) {
    console.error('Error al cargar productos:', productsResult.error);
    if (productsResult.error.message?.includes('not find the table')) {
      return {
        sales: 0,
        orders: 0,
        avgTicket: 0,
        topProducts: 'Base de datos no inicializada',
        recentOrders: [],
        products: [],
        businessName: 'Error: Ejecuta el SQL en Supabase',
        businessId
      };
    }
  }

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

  const { data: currentBiz } = await supabase.from('businesses').select('name').eq('id', businessId).single();

  return {
    sales: totalSales,
    orders: ordersCount,
    avgTicket,
    topProducts,
    recentOrders: (recentResult.data ?? []) as any[],
    products: (productsResult.data ?? []).map(mapProductRow),
    businessName: currentBiz?.name || 'Negocio'
  };
}
