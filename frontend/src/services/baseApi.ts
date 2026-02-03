import { retry } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: "http://localhost:3000",
      credentials: "include",
    }),
    {
      maxRetries: 3,
    },
  ),
  tagTypes: [],
  endpoints: () => ({}),
});

export default baseApi;
