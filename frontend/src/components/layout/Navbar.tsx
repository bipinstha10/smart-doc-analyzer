import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "../common/Button";
import { clearAuth } from "../../store/authSlice";
import type { RootState } from "../../store/store";

export const MainNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector(
    (state: RootState) => state.auth.access_token,
  );

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50  bg-white border-b border-[#9e9e9e8f]">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-5">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-semibold text-onBackground hover:opacity-80 transition-opacity"
            aria-label="DocCat+ Home"
          >
            DocCat+
          </Link>
          <nav className="hidden gap-6 text-sm text-secondary md:flex">
            <a
              href="#features"
              className="text-onBackground hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-onBackground hover:text-primary transition-colors cursor-pointer"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-onBackground hover:text-primary transition-colors cursor-pointer"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/grid">Grid</Link>
          {accessToken ? (
            <>
              <Link
                to="/dashboard"
                className="text-onBackground hover:text-primary transition-colors px-4 py-2 rounded-base"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-onBackground hover:text-primary transition-colors px-4 py-2 rounded-base cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-onBackground hover:text-primary transition-colors px-4 py-2 rounded-base"
              >
                Log in
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const AuthNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 md:px-8 md:py-5 bg-white border-b border-[#9e9e9e8f]">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-xl md:text-2xl font-semibold text-onBackground hover:opacity-80 transition-opacity"
          aria-label="DocCat+ Home"
        >
          DocCat+
        </Link>
      </div>
    </header>
  );
};
