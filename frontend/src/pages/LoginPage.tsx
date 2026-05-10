import LoginForm from "../components/features/auth/LoginForm";
import Divider from "../components/common/Divider";
import { UserRoundPlus } from "lucide-react";
import { Link, Navigate } from "react-router";
import { AuthNavbar } from "../components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const SignIn = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.access_token,
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.assign(`${BACKEND_URL}/auth/google/login`);
  };

  return (
    <div>
      <AuthNavbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-10 md:mt-10 md:px-4">
        <div className="w-full max-w-md">
          <div className="items-left mb-10">
            <h1 className="font-[teko] text-3xl md:text-5xl mb-5">Sign In</h1>
          </div>

          <LoginForm />

          <Divider text="OR" />

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full cursor-pointer text-black border border-gray-600 rounded py-2 md:py-4 flex items-center justify-center gap-8"
            >
              <img
                src="data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M17.4612 7.21757H16.751V7.18098H8.81632V10.7075H13.7989C13.072 12.7604 11.1187 14.234 8.81632 14.234C5.89503 14.234 3.52653 11.8655 3.52653 8.94425C3.52653 6.02296 5.89503 3.65446 8.81632 3.65446C10.1648 3.65446 11.3916 4.16316 12.3257 4.9941L14.8194 2.5004C13.2448 1.03292 11.1385 0.12793 8.81632 0.12793C3.94751 0.12793 0 4.07544 0 8.94425C0 13.8131 3.94751 17.7606 8.81632 17.7606C13.6851 17.7606 17.6326 13.8131 17.6326 8.94425C17.6326 8.35311 17.5718 7.77609 17.4612 7.21757Z' fill='%23FFC107' /%3E%3Cpath d='M1.0166 4.84069L3.9132 6.96498C4.69697 5.02451 6.59513 3.65446 8.8164 3.65446C10.1649 3.65446 11.3916 4.16316 12.3257 4.9941L14.8194 2.5004C13.2448 1.03292 11.1386 0.12793 8.8164 0.12793C5.43005 0.12793 2.49333 2.03975 1.0166 4.84069Z' fill='%23FF3D00' /%3E%3Cpath d='M8.8165 17.7612C11.0938 17.7612 13.1629 16.8897 14.7274 15.4725L11.9988 13.1635C11.0839 13.8593 9.96591 14.2356 8.8165 14.2347C6.52338 14.2347 4.57629 12.7725 3.84278 10.7319L0.967773 12.947C2.42687 15.8022 5.39004 17.7612 8.8165 17.7612Z' fill='%234CAF50' /%3E%3Cpath d='M17.4612 7.21823H16.7511V7.18164H8.81641V10.7082H13.7989C13.4512 11.6852 12.8249 12.539 11.9973 13.164L11.9987 13.1631L14.7273 15.4721C14.5342 15.6475 17.6327 13.3531 17.6327 8.9449C17.6327 8.35377 17.5719 7.77674 17.4612 7.21823Z' fill='%231976D2' /%3E%3C/svg%3E%0A"
                alt="google"
              ></img>
              <span>Continue with Google</span>
            </button>
            <Link
              to="/signup"
              className="w-full cursor-pointer text-black border border-gray-600 rounded py-2 md:py-4 flex items-center justify-center gap-8"
            >
              <UserRoundPlus />
              <span>Create a New Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
