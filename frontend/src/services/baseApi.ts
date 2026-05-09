import { retry } from "@reduxjs/toolkit/query";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { store } from "../store/store";
import { clearAuth, updateAccessToken } from "../store/authSlice";

// Create a mutex to prevent multiple refresh attempts
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait for any ongoing refresh to complete
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if we have a refresh token
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      // No refresh token, clear auth
      store.dispatch(clearAuth());
      return result;
    }

    // Check if we're already refreshing
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refresh_token: refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // Refresh successful, update stored tokens
          const { access_token } = refreshResult.data as {
            access_token: string;
          };

          // Update only the access token
          store.dispatch(updateAccessToken(access_token));

          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, clear auth
          store.dispatch(clearAuth());
        }
      } finally {
        release();
      }
    } else {
      // Wait for the ongoing refresh to complete, then retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: retry(baseQueryWithReauth, { maxRetries: 0 }), // Disable retry since we handle it manually
  tagTypes: ["User", "Document"],
  endpoints: () => ({}),
});

export default baseApi;
