import type { LocalCartItem } from "./cartSlice";

export const CART_STORAGE_KEY = "mui-store-cart";

// localStorage helper functions
export const getLocalCart = (): LocalCartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const setLocalCart = (cart: LocalCartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

export const clearLocalCart = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cart from localStorage:", error);
  }
};

// Calculate cart total
export const calculateCartTotal = (items: LocalCartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

// Calculate cart count
export const calculateCartCount = (items: LocalCartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Format cart items for API merge request
export const formatCartItemsForMerge = (items: LocalCartItem[]) => {
  return items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));
};

// Format price for display
export const formatPriceRub = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};
