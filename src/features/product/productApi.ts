import { apiSlice } from "@/app/apiSlice";

export interface Product {
  id: string | number;
  title: string;
  price: number;
  imageUrl: string;
}

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

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 12 } = {}) => ({
        url: `/products`,
        params: { page, per_page: perPage },
      }),
      // Normalize a few expected response shapes into a common contract
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
  }),
});

export const { useGetProductsQuery } = productApi;
