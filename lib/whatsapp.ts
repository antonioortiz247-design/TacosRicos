import { CartItem } from './types';

export function buildWhatsAppOrderMessage(params: {
  businessName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'pickup' | 'delivery';
  address?: string;
  references?: string;
  paymentMethod: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}): string {
  const lines = [
    `Pedido para ${params.businessName}`,
    '',
    ...params.items.map((item, idx) => {
      const config = item.config
        ? `${item.config.protein ? item.config.protein : `${item.config.tortilla}, ${item.config.extras.join(', ') || 'sin extras'}`}${item.config.notes ? `, nota: ${item.config.notes}` : ''}`
        : 'estándar';
      return `${idx + 1}. ${item.productName} x${item.quantity} - $${item.subtotal} (${config})`;
    }),
    '',
    `Entrega: ${params.deliveryType === 'pickup' ? 'Recoger en local' : 'Envío a domicilio'}`,
    params.address ? `Dirección: ${params.address}` : '',
    params.references ? `Referencias: ${params.references}` : '',
    `Pago: ${params.paymentMethod}`,
    params.paymentStatus ? `Estado de pago: ${params.paymentStatus}` : '',
    `Subtotal: $${params.subtotal}`,
    `Envío: $${params.deliveryFee}`,
    `Total: $${params.total}`
  ].filter(Boolean);

  return lines.join('\n');
}

export function getWhatsAppLink(phone: string, message: string): string {
  // Limpiamos el número de teléfono para que solo tenga dígitos
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
