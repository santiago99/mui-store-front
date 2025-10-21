import type { RootState } from "@/app/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LocalCartItem {
  product_id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
  };
}

interface CartState {
  localCart: LocalCartItem[];
  isDrawerOpen: boolean;
  animationTrigger: number;
}

const initialState: CartState = {
  localCart: [],
  isDrawerOpen: false,
  animationTrigger: 0,
};

const CART_STORAGE_KEY = "mui-store-cart";

// Helper functions for localStorage
const getLocalCartFromStorage = (): LocalCartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalCartToStorage = (cart: LocalCartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeLocalCart(state) {
      state.localCart = getLocalCartFromStorage();
    },
    addToLocalCart(state, action: PayloadAction<LocalCartItem>) {
      const { product_id, quantity, product } = action.payload;
      const existingItem = state.localCart.find(
        (item) => item.product_id === product_id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.localCart.push({ product_id, quantity, product });
      }

      saveLocalCartToStorage(state.localCart);
      state.animationTrigger += 1;
    },
    updateLocalCartItemQuantity(
      state,
      action: PayloadAction<{ product_id: number; quantity: number }>
    ) {
      const { product_id, quantity } = action.payload;
      const item = state.localCart.find(
        (item) => item.product_id === product_id
      );

      if (item) {
        if (quantity <= 0) {
          state.localCart = state.localCart.filter(
            (item) => item.product_id !== product_id
          );
        } else {
          item.quantity = quantity;
        }
        saveLocalCartToStorage(state.localCart);
      }
    },
    removeFromLocalCart(state, action: PayloadAction<number>) {
      state.localCart = state.localCart.filter(
        (item) => item.product_id !== action.payload
      );
      saveLocalCartToStorage(state.localCart);
    },
    clearLocalCart(state) {
      state.localCart = [];
      saveLocalCartToStorage(state.localCart);
    },
    setLocalCart(state, action: PayloadAction<LocalCartItem[]>) {
      state.localCart = action.payload;
      saveLocalCartToStorage(state.localCart);
    },
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openDrawer(state) {
      state.isDrawerOpen = true;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
    },
    triggerAnimation(state) {
      state.animationTrigger += 1;
    },
  },
});

export const {
  initializeLocalCart,
  addToLocalCart,
  updateLocalCartItemQuantity,
  removeFromLocalCart,
  clearLocalCart,
  setLocalCart,
  toggleDrawer,
  openDrawer,
  closeDrawer,
  triggerAnimation,
} = cartSlice.actions;

// Selectors
export const selectLocalCartItems = (state: RootState) => state.cart.localCart;
export const selectLocalCartCount = (state: RootState) =>
  state.cart.localCart.reduce((total, item) => total + item.quantity, 0);
export const selectLocalCartTotal = (state: RootState) =>
  state.cart.localCart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
export const selectIsDrawerOpen = (state: RootState) => state.cart.isDrawerOpen;
export const selectAnimationTrigger = (state: RootState) =>
  state.cart.animationTrigger;

export default cartSlice.reducer;
