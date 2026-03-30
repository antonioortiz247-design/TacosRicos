'use server';

import { getSupabaseClient } from './supabase';
import { OrderSchema, OrderInput } from './validations';
import { Product } from './types';

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
  } catch (error: any) {
    console.error('Error creating order:', error);
    const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return { success: false, error: `Error al crear el pedido: ${errorMessage}` };
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

export async function seedProducts(businessIdOrSlug: string) {
  try {
    console.log(`Iniciando seed para: ${businessIdOrSlug}`);
    const { getSupabaseAdmin, getSupabaseClient } = await import('./supabase');
    const adminClient = getSupabaseAdmin();
    const publicClient = getSupabaseClient();
    const supabase = adminClient || publicClient;
    
    if (!supabase) throw new Error('No se pudo conectar con la base de datos (Supabase)');
    if (!adminClient) throw new Error('Falta la variable SUPABASE_SERVICE_ROLE_KEY en el servidor.');

    // Validar que el identificador no sea un token filtrado
    if (businessIdOrSlug.startsWith('eyJ') || businessIdOrSlug.length > 50) {
      throw new Error('El ID de negocio parece ser un token de seguridad (JWT) en lugar de un nombre o UUID. Por favor revisa la variable NEXT_PUBLIC_DEFAULT_BUSINESS_ID en Vercel.');
    }

    let businessId = businessIdOrSlug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(businessIdOrSlug);
    
    if (!isUUID && businessIdOrSlug) {
      console.log(`Identificador "${businessIdOrSlug}" no es UUID, buscando slug...`);
      const { data: biz, error: bizError } = await supabase.from('businesses').select('id').eq('slug', businessIdOrSlug).maybeSingle();
      
      if (biz) {
        businessId = biz.id;
        console.log(`Negocio encontrado por slug: ${businessId}`);
      } else {
        console.log(`Slug no encontrado, intentando crear negocio: ${businessIdOrSlug}`);
        // Si no existe, lo creamos
        const { data: newBiz, error: createError } = await supabase
          .from('businesses')
          .insert({ name: businessIdOrSlug, slug: businessIdOrSlug })
          .select()
          .single();
        
        if (createError) {
          console.error('Error al crear negocio:', createError);
          throw new Error(`Error al crear el negocio "${businessIdOrSlug}": ${createError.message}`);
        }
        businessId = newBiz.id;
        console.log(`Nuevo negocio creado: ${businessId}`);
      }
    } else if (isUUID) {
      // Verificar que el UUID existe
      const { data: bizExists } = await supabase.from('businesses').select('id').eq('id', businessId).maybeSingle();
      if (!bizExists) {
        console.log(`UUID ${businessId} no existe, creando negocio con nombre genérico...`);
        const { data: newBiz, error: createError } = await supabase
          .from('businesses')
          .insert({ id: businessId, name: 'Mi Negocio', slug: `negocio-${businessId.slice(0, 8)}` })
          .select()
          .single();
        if (createError) throw new Error(`No se pudo crear el negocio con ID ${businessId}: ${createError.message}`);
      }
    }

    // Fallback products from menu page
    const baseProducts = ['Barriga', 'Suadero', 'Pechuga', 'Longaniza', 'Chile Relleno', 'Campechanos', 'Chorizo Argentino', 'Chuleta'];
    const productsToSeed = [
      ...baseProducts.map((name) => ({
        business_id: businessId,
        category: 'tacos',
        name,
        price: 32,
        active: true,
        customizable: true
      })),
      {
        business_id: businessId,
        category: 'especialidades',
        name: 'Burrito',
        price: 100,
        active: true,
        customizable: true
      },
      {
        business_id: businessId,
        category: 'especialidades',
        name: 'Gringas',
        price: 70,
        active: true,
        customizable: true
      }
    ];

    console.log(`Insertando ${productsToSeed.length} productos para el negocio ${businessId}`);
    const { error } = await supabase.from('products').insert(productsToSeed);
    
    if (error) {
      console.error('Error de Supabase al insertar productos:', error);
      throw error;
    }

    console.log('Seed completado con éxito');
    return { success: true };
  } catch (error: any) {
    console.error('Excepción en seedProducts:', error);
    let errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    
    if (errorMessage.includes('public.businesses') || errorMessage.includes('public.products')) {
      errorMessage = 'Error: No se encontraron las tablas en Supabase. Asegúrate de copiar y ejecutar el contenido de "supabase/schema.sql" en el SQL Editor de tu proyecto Supabase.';
    }
    
    return { success: false, error: errorMessage };
  }
}

export async function createProduct(product: Partial<Product>) {
  try {
    console.log('Creando nuevo producto:', product.name);
    const { getSupabaseAdmin, getSupabaseClient } = await import('./supabase');
    const adminClient = getSupabaseAdmin();
    const publicClient = getSupabaseClient();
    const supabase = adminClient || publicClient;
    
    if (!supabase) throw new Error('No se pudo conectar con la base de datos (Supabase)');
    if (!adminClient) throw new Error('Falta la variable SUPABASE_SERVICE_ROLE_KEY en el servidor.');

    if (!product.businessId) {
      throw new Error('No se recibió businessId para crear el producto');
    }

    let businessId = product.businessId;

    // Permite recibir UUID o slug desde el dashboard.
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(product.businessId);
    if (!isUUID) {
      const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', product.businessId)
        .maybeSingle();

      if (bizError) {
        throw new Error(`No se pudo resolver el negocio por slug: ${bizError.message}`);
      }

      if (!biz?.id) {
        throw new Error(`No existe un negocio con slug "${product.businessId}"`);
      }

      businessId = biz.id;
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        business_id: businessId,
        category: product.category,
        name: product.name,
        price: product.price,
        active: true,
        customizable: product.customizable ?? true,
        description: product.description,
        image_url: product.imageUrl
      })
      .select()
      .single();

    if (error) {
      console.error('Error de Supabase al crear producto:', error);
      throw error;
    }
    
    console.log('Producto creado con éxito:', data.id);
    return {
      success: true,
      product: {
        id: data.id,
        businessId: data.business_id,
        category: data.category,
        name: data.name,
        description: data.description ?? undefined,
        price: Number(data.price),
        imageUrl: data.image_url ?? undefined,
        active: Boolean(data.active),
        customizable: data.customizable ?? true
      }
    };
  } catch (error: any) {
    console.error('Excepción en createProduct:', error);
    let errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    
    if (errorMessage.includes('public.products')) {
      errorMessage = 'Error: La tabla de productos no existe. Ejecuta el SQL de "supabase/schema.sql" en Supabase.';
    }
    
    return { success: false, error: errorMessage };
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
