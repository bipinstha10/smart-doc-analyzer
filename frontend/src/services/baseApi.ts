import { retry } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: "http://localhost:8000",
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("access_token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
      },
    }),
    {
      maxRetries: 3,
    },
  ),
  tagTypes: ["User", "Document"],
  endpoints: () => ({}),
});

export default baseApi;
