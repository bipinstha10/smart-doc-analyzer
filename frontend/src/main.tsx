// main.tsx
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";

import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";

// Lazy load heavy pages
const DashBoardPage = lazy(() => import("./pages/DashBoardPage.tsx"));
const HistoryPage = lazy(() => import("./pages/HistoryPage.tsx"));
const OAuthSuccessPage = lazy(() => import("./pages/OAuthSuccessPage.tsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <DashBoardPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <HistoryPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/oauth-success" 
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <OAuthSuccessPage />
          </Suspense>
        } 
      />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {" "}
      {/* ✅ Single Provider */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
