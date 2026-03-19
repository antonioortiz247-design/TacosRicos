import { CartItem } from './types';

export function buildWhatsAppOrderMessage(params: {
  businessName: string;
  items: CartItem[];
  total: number;
  deliveryType: 'pickup' | 'delivery';
  address?: string;
  paymentMethod: string;
}): string {
  const lines = [
    `Pedido para ${params.businessName}`,
    '',
    ...params.items.map(
      (item, idx) =>
        `${idx + 1}. ${item.productName} x${item.quantity} - $${item.subtotal} (${item.config.tortilla}, ${item.config.extras.join(', ') || 'sin extras'})`
    ),
    '',
    `Entrega: ${params.deliveryType}`,
    params.address ? `Dirección: ${params.address}` : '',
    `Pago: ${params.paymentMethod}`,
    `Total: $${params.total}`
  ].filter(Boolean);

  return lines.join('\n');
}

export function getWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
