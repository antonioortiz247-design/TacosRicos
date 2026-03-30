'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, DeliveryType, PaymentMethod } from '@/lib/types';
import { deliveryFeeByZone } from '@/lib/pricing';

type Zone = 'zona1' | 'zona2' | 'zona3';

type CartState = {
  items: CartItem[];
  deliveryType: DeliveryType;
  zone: Zone;
  paymentMethod: PaymentMethod;
  address: string;
  address_references: string;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, item: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  setDelivery: (type: DeliveryType, zone?: Zone) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAddress: (address: string) => void;
  setReferences: (references: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: 'pickup',
      zone: 'zona1',
      paymentMethod: 'cash',
      address: '',
      address_references: '',
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, patch) => set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      setDelivery: (deliveryType, zone = 'zona1') => set(() => ({ deliveryType, zone })),
      setPaymentMethod: (paymentMethod) => set(() => ({ paymentMethod })),
      setAddress: (address) => set(() => ({ address })),
      setReferences: (references) => set(() => ({ address_references: references })),
      clearCart: () => set({ items: [], deliveryType: 'pickup', zone: 'zona1', paymentMethod: 'cash', address: '', address_references: '' }),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
      getDeliveryFee: () => (get().deliveryType === 'delivery' ? deliveryFeeByZone(get().zone) : 0),
      getTotal: () => get().getSubtotal() + get().getDeliveryFee()
    }),
    {
      name: 'tacos-ricos-cart'
    }
  )
);
