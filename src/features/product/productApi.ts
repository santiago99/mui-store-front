export interface Product {
  id: string | number;
  title: string;
  price: number;
  imageUrl: string;
}

// export const productApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getProducts: builder.query<
//       PaginatedResponse<Product>,
//       { page?: number; perPage?: number }
//     >({
//       query: ({ page = 1, perPage = 12 } = {}) => ({
//         url: `/products`,
//         params: { page, per_page: perPage },
//       }),
//       //transformResponse: (response: unknown/* , meta */): PaginatedResponse<Product> => response,
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map((p) => ({
//                 type: "Product" as const,
//                 id: p.id,
//               })),
//               { type: "Product" as const, id: "PARTIAL-LIST" },
//             ]
//           : [{ type: "Product" as const, id: "PARTIAL-LIST" }],
//     }),
//   }),
// });
