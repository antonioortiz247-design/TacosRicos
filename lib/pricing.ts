import { TacoConfig } from './types';

export const BASE_TACO_PRICE = 32;
export const QUESO_EXTRA = 8;

export function calculateTacoPrice(config: TacoConfig, basePrice = BASE_TACO_PRICE): number {
  const hasQueso = config.extras.includes('queso');
  if (hasQueso) return basePrice + QUESO_EXTRA;
  return basePrice;
}

export function deliveryFeeByZone(zone: 'zona1' | 'zona2' | 'zona3'): number {
  if (zone === 'zona1') return 20;
  if (zone === 'zona2') return 30;
  return 40;
}
