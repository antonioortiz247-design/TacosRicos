'use server';

import { getSupabaseClient } from './supabase';
import { OrderSchema, OrderInput } from './validations';

export async function createOrder(params: OrderInput) {
  try {
    const { getSupabaseAdmin, getSupabaseClient } = await import('./supabase');
    
    // Intentamos usar el cliente admin para insertar el pedido (anon users)
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    
    if (!supabase) throw new Error('No se pudo conectar con la base de datos');

    // Validar datos en el servidor
    const validated = OrderSchema.parse(params);

    let businessId = validated.businessId;

    // Si el businessId no parece un UUID, intentamos buscarlo por slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(businessId);
    
    if (!isUUID) {
      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', businessId)
        .single();
      
      if (biz) {
        businessId = biz.id;
      } else {
        throw new Error(`El negocio "${businessId}" no está registrado.`);
      }
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        business_id: businessId,
        items: validated.items,
        total: validated.total,
        delivery_type: validated.deliveryType,
        address: validated.address,
        address_references: validated.address_references,
        payment_method: validated.paymentMethod,
        payment_status: 'pending',
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insertar items individuales para reportes más detallados
    const orderItems = validated.items.map((item) => ({
      order_id: order.id,
      product_name: item.productName,
      config: item.config,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'No se pudo crear el pedido' };
  }
}

export async function updateProductPrice(productId: string, newPrice: number) {
  try {
    const { getSupabaseAdmin, getSupabaseClient } = await import('./supabase');
    
    // Intentamos usar el cliente admin para saltar RLS si es una acción de dashboard
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    
    if (!supabase) throw new Error('No se pudo conectar con la base de datos');

    const { error } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating product price:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'No se pudo actualizar el precio' 
    };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { getSupabaseAdmin, getSupabaseClient } = await import('./supabase');
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    
    if (!supabase) throw new Error('No se pudo conectar con la base de datos');

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'No se pudo actualizar el estado' 
    };
  }
}
