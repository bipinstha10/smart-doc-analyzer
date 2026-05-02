import type {
  TokenResponse,
  User,
  UserListResponse,
  UserLoginInput,
  // UserLoginResponse,
  UserResponse,
} from "../types/userInput";
import baseApi from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserListResponse, void>({
      query: () => {
        const url = "users";

        return {
          url,
        };
      },
      providesTags: ["User"],
    }),

    getUser: build.query<UserResponse, string>({
      query: (id) => {
        const url = `users/${id}`;

        return {
          url,
        };
      },
      providesTags: ["User"],
    }),

    postUsers: build.mutation<
      TokenResponse,
      { email: string; password: string }
    >({
      query: (userInput) => ({
        url: "/auth/signup",
        method: "POST",
        body: userInput,
      }),
      invalidatesTags: ["User"],
    }),

    postUsersLogin: build.mutation<TokenResponse, UserLoginInput>({
      query: (userLoginInput) => ({
        url: "/auth/login",
        method: "POST",
        body: userLoginInput,
      }),
      invalidatesTags: [],
    }),

    updateUsers: build.mutation<UserResponse, { id: string; userInput: User }>({
      query: ({ id, userInput }) => {
        const url = `users/${id}`;

        return {
          url,
          method: "PUT",
          body: userInput,
        };
      },
      invalidatesTags: ["User"],
    }),

    deleteUser: build.mutation<UserResponse, number>({
      query: (id) => {
        const url = `users/${id}`;

        return {
          url,
          method: "DELETE",
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUserQuery,
  usePostUsersMutation,
  useUpdateUsersMutation,
  useDeleteUserMutation,
  usePostUsersLoginMutation,
  usePostUsersMutation: useSignupMutation,
  usePostUsersLoginMutation: useLoginMutation,
} = userApi;
