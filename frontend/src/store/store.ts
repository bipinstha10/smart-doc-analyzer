// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import scoreReducer from "./scoreSlice";
import authReducer from "./authSlice";
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    score: scoreReducer,
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
