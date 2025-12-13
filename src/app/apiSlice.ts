import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  QueryReturnValue,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { Product, Brand } from "@/features/product/productApi";
import type { Category, Filter } from "@/features/category/categoryApi";
import type { FilterValue } from "@/features/category/filtersSlice";
import {
  upsertCategories,
  upsertCategory,
  categoriesSelectors,
} from "@/features/category/categoriesSlice";
import type { RootState } from "./store";

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

// Helper function to flatten category tree recursively
function flattenCategoryTree(categories: Category[]): Category[] {
  const result: Category[] = [];

  function traverse(category: Category, parentId: number | null = null) {
    // Create a normalized flat category without nested structures
    // Children are stored separately and can be retrieved via selectCategoryChildren selector
    const flatCategory: Category = {
      ...category,
      parentId: parentId,
      children: undefined, // Remove children - stored separately, use selectCategoryChildren selector
      ancestors: undefined, // Remove ancestors - computed via selectCategoryAncestors selector
    };
    result.push(flatCategory);

    // Recursively process children
    if (category.children && category.children.length > 0) {
      category.children.forEach((child) => {
        traverse(child, category.id);
      });
    }
  }

  categories.forEach((category) => traverse(category));
  return result;
}

// Add filters into query params
function appendFiltersToParams(
  filters: { [filterId: string]: FilterValue },
  params: URLSearchParams
) {
  Object.entries(filters).forEach(([filterId, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        // Checkboxes: array of values
        if (value.length > 0) {
          value.forEach((v) => {
            params.append(`filters[${filterId}][]`, String(v));
          });
        }
      } else if (
        typeof value === "object" &&
        "min" in value &&
        "max" in value
      ) {
        // Range: object with min/max
        params.append(`filters[${filterId}][min]`, String(value.min));
        params.append(`filters[${filterId}][max]`, String(value.max));
      } else if (typeof value === "string") {
        // Text/Select: single string value
        params.append(`filters[${filterId}]`, value);
      }
    }
  });
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
      {
        page?: number;
        perPage?: number;
        category_id?: string | number;
        filters?: { [filterId: string]: FilterValue };
        brand_id?: string | number | string[] | null;
      }
    >({
      query: ({
        page = 1,
        perPage = 12,
        category_id,
        filters,
        brand_id,
      } = {}) => {
        const queryParams = new URLSearchParams();

        // Add page and per_page
        queryParams.append("page", String(page));
        queryParams.append("per_page", String(perPage));

        // Add category_id if present
        if (category_id) {
          queryParams.append("category_id", String(category_id));
        }

        if (filters && Object.keys(filters).length > 0) {
          appendFiltersToParams(filters, queryParams);
        }

        // Add brand_id with proper array handling
        if (brand_id) {
          if (Array.isArray(brand_id)) {
            brand_id.forEach((id) => {
              queryParams.append("brand_id[]", String(id));
            });
          } else {
            queryParams.append("brand_id", String(brand_id));
          }
        }

        return {
          url: `/products?${queryParams.toString()}`,
        };
      },
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
      queryFn: async (
        id,
        _queryApi,
        _extraOptions,
        baseQuery
      ): Promise<
        QueryReturnValue<
          Category,
          FetchBaseQueryError,
          FetchBaseQueryMeta | undefined
        >
      > => {
        // Check cache first
        const state = _queryApi.getState() as RootState;
        const cachedCategory: Category | undefined =
          categoriesSelectors.selectById(state, id);

        if (cachedCategory) {
          // Return cached category
          return { data: cachedCategory as Category };
        }

        // Not in cache, fetch from server
        const result = await baseQuery({
          url: `/categories/${id}`,
        });

        if (result.error) {
          return result;
        }

        const category = (result.data as SingleDataResponse<Category>).data;

        // Remove nested structures before storing (normalized flat structure)
        // Children can be retrieved via selectCategoryChildren selector
        // Ancestors can be retrieved via selectCategoryAncestors selector
        const categoryToStore: Category = {
          ...category,
          children: undefined, // Remove children - stored separately, use selectCategoryChildren selector
          ancestors: undefined, // Remove ancestors - computed via selectCategoryAncestors selector
        };

        // Update cache with fetched category
        _queryApi.dispatch(upsertCategory(categoryToStore));

        return { data: category };
      },
      providesTags: (result) =>
        result ? [{ type: "Category" as const, id: result.id }] : [],
    }),
    getCategoriesTree: builder.query<Category[], void>({
      query: () => ({
        url: `/categories`,
      }),
      transformResponse: (response: unknown): Category[] =>
        (response as ListDataResponse<Category>).data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Flatten the tree and populate the adapter cache
          const flattened = flattenCategoryTree(data);
          dispatch(upsertCategories(flattened));
        } catch {
          // Ignore errors - the query will handle them
        }
      },
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
    getCategoryFilters: builder.query<Filter[], number>({
      query: (id) => ({
        url: `/categories/${id}/filters`,
      }),
      transformResponse: (response: unknown): Filter[] =>
        (response as ListDataResponse<Filter>).data,
      providesTags: (result, _error, id) =>
        result
          ? [
              ...result.map((f) => ({
                type: "Category" as const,
                id: `filters-${id}-${f.id}`,
              })),
              { type: "Category" as const, id: `filters-${id}` },
            ]
          : [{ type: "Category" as const, id: `filters-${id}` }],
    }),
    getBrandBySlug: builder.query<Brand, string>({
      query: (slug) => ({
        url: `/brands/${slug}`,
      }),
      transformResponse: (response: unknown): Brand =>
        (response as SingleDataResponse<Brand>).data,
      providesTags: (result) =>
        result ? [{ type: "Product" as const, id: `brand-${result.id}` }] : [],
    }),
    getCollection: builder.query<Product[], string>({
      query: (collectionSlug) => ({
        url: `/collections/${collectionSlug}`,
      }),
      transformResponse: (response: unknown): Product[] =>
        (response as ListDataResponse<Product>).data,
      providesTags: (result, _error, collectionSlug) =>
        result
          ? [
              ...result.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Product" as const, id: "LIST" },
              { type: "Product" as const, id: `collection-${collectionSlug}` },
            ]
          : [
              { type: "Product" as const, id: "LIST" },
              { type: "Product" as const, id: `collection-${collectionSlug}` },
            ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesTreeQuery,
  useGetCategoryQuery,
  useGetCategoryFiltersQuery,
  useGetBrandBySlugQuery,
  useGetCollectionQuery,
  util: { prefetch },
} = apiSlice;
