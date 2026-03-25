'use server';

import { getSupabaseClient } from './supabase';
import { OrderSchema, OrderInput } from './validations';

export async function createOrder(params: OrderInput) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('No se pudo conectar con la base de datos');

    // Validar datos en el servidor
    const validated = OrderSchema.parse(params);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        business_id: validated.businessId,
        items: validated.items,
        total: validated.total,
        delivery_type: validated.deliveryType,
        address: validated.address,
        references: validated.references,
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
