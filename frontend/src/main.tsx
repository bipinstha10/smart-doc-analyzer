import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Home from "./views/Home.tsx";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import baseApi from "./services/baseApi.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiProvider api={baseApi}>
      <RouterProvider router={router} />
    </ApiProvider>
  </StrictMode>,
);
