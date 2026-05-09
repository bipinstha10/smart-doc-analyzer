import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TokenResponse, UserResponse } from "../types/userInput";

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: UserResponse | null;
}

const initialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
  refresh_token: localStorage.getItem("refresh_token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TokenResponse>) => {
      const { access_token, refresh_token, user } = action.payload;

      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.user = user;

      // Persist
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;

      // Update persisted token
      localStorage.setItem("access_token", action.payload);
    },
    clearAuth: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, clearAuth, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
