import { Link } from "react-router";
import Button from "../common/Button";

export const MainNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-white border-b border-[#9e9e9e8f]">
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
        <Link
          to="/login"
          className="text-onBackground hover:text-primary transition-colors px-4 py-2 rounded-base"
        >
          Log in
        </Link>
        <Link to="/signup">
          <Button>Get Started</Button>
        </Link>
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
