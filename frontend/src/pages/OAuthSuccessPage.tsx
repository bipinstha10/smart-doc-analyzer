import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setCredentials } from "../store/authSlice";
import type { TokenResponse } from "../types/userInput";

const OAuthSuccessPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
    const token_type = searchParams.get("token_type") ?? "bearer";
    const user_id = searchParams.get("user_id");
    const user_email = searchParams.get("user_email");
    const user_created_at = searchParams.get("user_created_at");

    if (!access_token || !refresh_token || !user_id || !user_email) {
      navigate("/login", { replace: true });
      return;
    }

    const payload: TokenResponse = {
      access_token,
      refresh_token,
      token_type,
      user: {
        id: Number(user_id),
        email: user_email,
        created_at: user_created_at ?? new Date().toISOString(),
      },
    };

    dispatch(setCredentials(payload));
    navigate("/dashboard", { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p className="text-xl font-semibold text-onBackground">
          Signing you in with Google...
        </p>
        <p className="mt-3 text-sm text-[#555]">
          If you are not redirected automatically, please wait or refresh the
          page.
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;
