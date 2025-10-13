import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/features/product/productApi";

export interface PaginatedResponseMeta {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  last_page: number;
  total: number;
  links: number;
  path: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedResponseMeta;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  parent_id: string | number | null;
  depth: number;
  full_path: string;
  has_children: boolean;
  is_leaf: boolean;
  products_count: number;
  children: Category[];
  created_at: string;
  updated_at: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BACKEND_URL + "/api/v1/",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("X-Requested-With", "XMLHttpRequest");
      return headers;
    },
  }),
  tagTypes: ["Product", "Category"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 12 } = {}) => ({
        url: `/products`,
        params: { page, per_page: perPage },
      }),
      //transformResponse: (response: unknown/* , meta */): PaginatedResponse<Product> => response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Product" as const, id: "PARTIAL-LIST" },
            ]
          : [{ type: "Product" as const, id: "PARTIAL-LIST" }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: `/categories`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Category" as const, id: c.id })),
              { type: "Category" as const, id: "TREE" },
            ]
          : [{ type: "Category" as const, id: "TREE" }],
    }),
  }),
});

export const { useGetProductsQuery, useGetCategoriesQuery } = apiSlice;
