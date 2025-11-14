import { apiSlice } from "@/app/apiSlice";
import type { Product } from "@/features/product/productApi";

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface MergeCartRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface CartResponse {
  data: CartItem[];
}

export interface SingleCartItemResponse {
  data: CartItem;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => "/cart",
      transformResponse: (response: unknown): CartItem[] =>
        (response as CartResponse).data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Cart" as const,
                id: item.id,
              })),
              { type: "Cart" as const, id: "LIST" },
            ]
          : [{ type: "Cart" as const, id: "LIST" }],
    }),
    addToCart: builder.mutation<CartItem, AddToCartRequest>({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: unknown): CartItem =>
        (response as SingleCartItemResponse).data,
      invalidatesTags: [{ type: "Cart" as const, id: "LIST" }],
    }),
    updateCartItem: builder.mutation<
      CartItem,
      { cartItemId: number; data: UpdateCartItemRequest }
    >({
      query: ({ cartItemId, data }) => ({
        url: `/cart/${cartItemId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: unknown): CartItem =>
        (response as SingleCartItemResponse).data,
      invalidatesTags: (_, __, { cartItemId }) => [
        { type: "Cart" as const, id: cartItemId },
        { type: "Cart" as const, id: "LIST" },
      ],
    }),
    removeCartItem: builder.mutation<void, number>({
      query: (cartItemId) => ({
        url: `/cart/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, cartItemId) => [
        { type: "Cart" as const, id: cartItemId },
        { type: "Cart" as const, id: "LIST" },
      ],
    }),
    mergeCart: builder.mutation<CartItem[], MergeCartRequest>({
      query: (data) => ({
        url: "/cart/merge",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: unknown): CartItem[] =>
        (response as CartResponse).data,
      invalidatesTags: [{ type: "Cart" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
} = cartApi;
