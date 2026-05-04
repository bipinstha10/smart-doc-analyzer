import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/",
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.access_token,
  );

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
