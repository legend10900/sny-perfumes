import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/lib/types";

export const FREE_SHIPPING_THRESHOLD = 600;
export const STANDARD_SHIPPING_FEE = 49;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  selectedProductForModal: Product | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getFreeShippingProgress: () => { remaining: number; progressPercent: number; isFree: boolean };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      selectedProductForModal: null,

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      openProductModal: (product: Product) => set({ selectedProductForModal: product }),
      closeProductModal: () => set({ selectedProductForModal: null }),

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === newItem.id);
          const addQty = newItem.quantity || 1;

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += addQty;
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { ...newItem, quantity: addQty }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return { items: updated };
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShippingFee();
      },

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
        const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        return {
          remaining,
          progressPercent,
          isFree: remaining === 0 && subtotal > 0,
        };
      },
    }),
    {
      name: "sny-perfumes-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
