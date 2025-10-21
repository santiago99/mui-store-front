import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import {
  selectLocalCartItems,
  selectLocalCartCount,
  selectLocalCartTotal,
  addToLocalCart,
  updateLocalCartItemQuantity,
  removeFromLocalCart,
  clearLocalCart,
  triggerAnimation,
} from "./cartSlice";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "./cartApi";
import type { Product } from "@/features/product/productApi";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const localCartItems = useAppSelector(selectLocalCartItems);
  const localCartCount = useAppSelector(selectLocalCartCount);
  const localCartTotal = useAppSelector(selectLocalCartTotal);

  // API queries and mutations
  const { data: serverCartItems = [], isLoading: isLoadingServerCart } =
    useGetCartQuery(undefined, {
      skip: !isAuthenticated,
    });
  const [addToCartMutation, { isLoading: isAddingToCart }] =
    useAddToCartMutation();
  const [updateCartItemMutation, { isLoading: isUpdatingCart }] =
    useUpdateCartItemMutation();
  const [removeCartItemMutation, { isLoading: isRemovingFromCart }] =
    useRemoveCartItemMutation();

  // Determine which cart to use
  const cartItems = isAuthenticated ? serverCartItems : localCartItems;
  const cartCount = isAuthenticated
    ? serverCartItems.reduce((total, item) => total + item.quantity, 0)
    : localCartCount;
  const cartTotal = isAuthenticated
    ? serverCartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )
    : localCartTotal;

  const isLoading = isAuthenticated ? isLoadingServerCart : false;

  // Add item to cart
  const addItem = useCallback(
    async (product: Product, quantity: number = 1) => {
      try {
        if (isAuthenticated) {
          await addToCartMutation({
            product_id: product.id as number,
            quantity,
          }).unwrap();
        } else {
          dispatch(
            addToLocalCart({
              product_id: product.id as number,
              quantity,
              product: {
                id: product.id as number,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
              },
            })
          );
        }
        dispatch(triggerAnimation());
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        throw error;
      }
    },
    [isAuthenticated, addToCartMutation, dispatch]
  );

  // Update item quantity
  const updateItemQuantity = useCallback(
    async (productId: number, quantity: number) => {
      try {
        if (isAuthenticated) {
          const cartItem = serverCartItems.find(
            (item) => item.product_id === productId
          );
          if (cartItem) {
            await updateCartItemMutation({
              cartItemId: cartItem.id,
              data: { quantity },
            }).unwrap();
          }
        } else {
          dispatch(
            updateLocalCartItemQuantity({ product_id: productId, quantity })
          );
        }
      } catch (error) {
        console.error("Failed to update item quantity:", error);
        throw error;
      }
    },
    [isAuthenticated, serverCartItems, updateCartItemMutation, dispatch]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (productId: number) => {
      try {
        if (isAuthenticated) {
          const cartItem = serverCartItems.find(
            (item) => item.product_id === productId
          );
          if (cartItem) {
            await removeCartItemMutation(cartItem.id).unwrap();
          }
        } else {
          dispatch(removeFromLocalCart(productId));
        }
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
        throw error;
      }
    },
    [isAuthenticated, serverCartItems, removeCartItemMutation, dispatch]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // For authenticated users, we'd need to implement a clear all endpoint
        // For now, remove items one by one
        for (const item of serverCartItems) {
          await removeCartItemMutation(item.id).unwrap();
        }
      } else {
        dispatch(clearLocalCart());
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  }, [isAuthenticated, serverCartItems, removeCartItemMutation, dispatch]);

  return {
    // State
    items: cartItems,
    count: cartCount,
    total: cartTotal,
    isLoading,
    isAuthenticated,

    // Actions
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,

    // Loading states
    isAddingToCart,
    isUpdatingCart,
    isRemovingFromCart,
  };
};
