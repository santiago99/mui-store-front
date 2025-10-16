import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/features/product/productApi";
import type { Category } from "@/features/category/categoryApi";

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

export interface SingleDataResponse<T> {
  data: T;
}
export interface ListDataResponse<T> {
  data: T[];
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
      { page?: number; perPage?: number; category_id?: string | number }
    >({
      query: ({ page = 1, perPage = 12, category_id } = {}) => ({
        url: `/products`,
        params: {
          page,
          per_page: perPage,
          ...(category_id && { category_id }),
        },
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
    getCategory: builder.query<Category, number>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
      transformResponse: (response: unknown): Category =>
        (response as SingleDataResponse<Category>).data,
      providesTags: (result) =>
        result ? [{ type: "Category" as const, id: result.id }] : [],
    }),
    getCategoriesTree: builder.query<Category[], void>({
      query: () => ({
        url: `/categories`,
      }),
      transformResponse: (response: unknown): Category[] =>
        (response as ListDataResponse<Category>).data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({
                type: "Category" as const,
                id: c.id,
              })),
              { type: "Category" as const, id: "TREE" },
            ]
          : [{ type: "Category" as const, id: "TREE" }],
    }),
  }),
});

export const { useGetProductsQuery, useGetCategoriesTreeQuery, useGetCategoryQuery } = apiSlice;
