export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'transfer' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered';

export type Product = {
  id: string;
  businessId: string;
  category: 'tacos' | 'especialidades' | 'promociones';
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active: boolean;
};

export type TacoConfig = {
  tortilla: 'maiz' | 'harina';
  extras: Array<'queso' | 'papas'>;
  notes?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  config: TacoConfig;
  unitPrice: number;
  subtotal: number;
};
