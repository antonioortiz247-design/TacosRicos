import { z } from 'zod';

export const TacoConfigSchema = z.object({
  tortilla: z.enum(['maiz', 'harina']),
  extras: z.array(z.enum(['queso', 'papas'])),
  protein: z.string().optional(),
  notes: z.string().optional(),
});

export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().min(1),
  config: TacoConfigSchema.optional(),
  unitPrice: z.number(),
  subtotal: z.number(),
});

export const OrderSchema = z.object({
  businessId: z.string(),
  items: z.array(CartItemSchema),
  total: z.number(),
  deliveryType: z.enum(['pickup', 'delivery']),
  address: z.string().optional(),
  address_references: z.string().optional(),
  paymentMethod: z.enum(['cash', 'transfer']),
});

export type OrderInput = z.infer<typeof OrderSchema>;
