'use server';

import { supabase } from './supabase';
import { CartItem, DeliveryType, PaymentMethod } from './types';

export async function createOrder(params: {
  businessId: string;
  items: CartItem[];
  total: number;
  deliveryType: DeliveryType;
  address?: string;
  references?: string;
  paymentMethod: PaymentMethod;
}) {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        business_id: params.businessId,
        items: params.items,
        total: params.total,
        delivery_type: params.deliveryType,
        address: params.address,
        references: params.references,
        payment_method: params.paymentMethod,
        payment_status: 'pending',
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insertar items individuales para reportes más detallados
    const orderItems = params.items.map((item) => ({
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
