import type {
  User,
  UserListResponse,
  UserLoginInput,
  UserLoginResponse,
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
      providesTags: ["users"],
    }),

    getUser: build.query<UserResponse, string>({
      query: (id) => {
        const url = `users/${id}`;

        return {
          url,
        };
      },
      providesTags: ["user"],
    }),

    postUsers: build.mutation<UserResponse, User>({
      query: (userInput) => {
        const url = "/users";

        return {
          url,
          method: "POST",
          body: userInput,
        };
      },
      invalidatesTags: ["users"],
    }),

    postUsersLogin: build.mutation<UserLoginResponse, UserLoginInput>({
      query: (userLoginInput) => {
        const url = "/users/login";

        return {
          url,
          method: "POST",
          body: userLoginInput,
        };
      },
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
      invalidatesTags: ["users"],
    }),

    deleteUser: build.mutation<UserResponse, number>({
      query: (id) => {
        const url = `users/${id}`;

        return {
          url,
          method: "DELETE",
        };
      },
      invalidatesTags: ["users"],
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
} = userApi;
