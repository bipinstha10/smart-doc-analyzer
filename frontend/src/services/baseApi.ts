import { retry } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: "http://localhost:8000",
      credentials: "include",
    }),
    {
      maxRetries: 3,
    },
  ),
  tagTypes: ["users", "user"],
  endpoints: () => ({}),
});

export default baseApi;
