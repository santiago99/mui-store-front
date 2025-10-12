import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  tagTypes: ["Product"],
  endpoints: () => ({}),
});
