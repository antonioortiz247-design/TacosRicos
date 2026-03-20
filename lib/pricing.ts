import { TacoConfig } from './types';

export const BASE_TACO_PRICE = 32;

export function calculateTacoPrice(config: TacoConfig): number {
  const hasQueso = config.extras.includes('queso');
  if (hasQueso) return 40;
  return BASE_TACO_PRICE;
}

export function deliveryFeeByZone(zone: 'zona1' | 'zona2' | 'zona3'): number {
  if (zone === 'zona1') return 20;
  if (zone === 'zona2') return 30;
  return 40;
}
