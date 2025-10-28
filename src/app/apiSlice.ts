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

// Helper function to get cookies
function getCookie(name: string): string | null {
  const regex = new RegExp(`(^| )${name}=([^;]+)`);
  const decodedCookie = decodeURIComponent(document.cookie);
  const match = decodedCookie.match(regex);
  return match ? match[2] : null;
}

// Helper function to fetch CSRF token
async function fetchCsrfToken(): Promise<void> {
  try {
    await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });
  } catch (error) {
    console.warn("Failed to fetch CSRF token:", error);
  }
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BACKEND_URL + "/api/v1/",
    credentials: "include",
    prepareHeaders: async (headers, { endpoint }) => {
      headers.set("Content-Type", "application/json");
      headers.set("X-Requested-With", "XMLHttpRequest");

      // For auth endpoints that require CSRF protection, ensure we have a CSRF token
      const authEndpoints = [
        "login",
        "register",
        "logout",
        "forgot-password", // ?
        "reset-password", //?
        "updateProfile",
        "updatePassword",
        "requestPasswordReset",
        "resetPassword",
        "addToCart",
        "updateCartItem",
        "removeCartItem",
        "mergeCart",
      ];
      if (
        authEndpoints.some((authEndpoint) => endpoint.includes(authEndpoint))
      ) {
        // Check if we have a CSRF token, if not fetch it
        let csrfToken = getCookie("XSRF-TOKEN");
        if (!csrfToken) {
          await fetchCsrfToken();
          csrfToken = getCookie("XSRF-TOKEN");
        }

        if (csrfToken) {
          headers.set("X-XSRF-TOKEN", decodeURIComponent(csrfToken));
        }
      }

      return headers;
    },
  }),
  tagTypes: ["Product", "Category", "User", "Cart"],
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
    getProduct: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      transformResponse: (response: unknown): Product =>
        (response as SingleDataResponse<Product>).data,
      providesTags: (result) =>
        result ? [{ type: "Product" as const, id: result.id }] : [],
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

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesTreeQuery,
  useGetCategoryQuery,
} = apiSlice;
