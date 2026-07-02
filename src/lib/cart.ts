"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";
import { trackAddToCart, trackRemoveFromCart } from "./analytics";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function getMaxQuantity(product: Product): number {
  return Math.max(0, product.stockQuantity);
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (product: Product, quantity: number = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        const maxQuantity = getMaxQuantity(product);

        if (maxQuantity <= 0) {
          return;
        }

        if (existingItem) {
          const nextQuantity = Math.min(
            existingItem.quantity + quantity,
            maxQuantity
          );

          if (nextQuantity === existingItem.quantity) {
            set({ isOpen: true });
            return;
          }

          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: nextQuantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...product, quantity: Math.min(quantity, maxQuantity) },
            ],
          });
        }

        // Track add to cart event
        trackAddToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          quantity,
        });

        // Open cart when item is added
        set({ isOpen: true });
      },

      removeItem: (id: string) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          // Track remove from cart event
          trackRemoveFromCart({
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
          });
        }
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const item = get().items.find((entry) => entry.id === id);
        if (!item) {
          return;
        }

        const maxQuantity = getMaxQuantity(item);
        if (maxQuantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, maxQuantity) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "yunik-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
