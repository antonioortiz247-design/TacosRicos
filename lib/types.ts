export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered';

export type ProductCategory = 'tacos' | 'especialidades' | 'viernes' | 'miercoles' | 'jueves';

export type Product = {
  id: string;
  businessId: string;
  category: ProductCategory;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  customizable?: boolean;
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
  config?: TacoConfig;
  unitPrice: number;
  subtotal: number;
};
