import { Upload, History } from "lucide-react";
import { Link, useLocation } from "react-router";
import Button from "../common/Button";

export const Sidebar = () => {
  const location = useLocation();

  // Define nav items once
  const navItems = [
    { label: "Upload", href: "/dashboard", icon: Upload },
    { label: "History", href: "/history", icon: History },
  ];

  return (
    <aside className="px-4 py-8">
      {/* Logo */}
      <Link to="/" className="text-xl font-semibold text-onBackground">
        DocCat+
      </Link>

      {/* Workspace info */}
      <p className="mt-2 font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
        Workspace / Personal
      </p>

      {/* New Classification button */}
      <Link
        to="/dashboard"
        className="mt-7 block w-full text-center text-sm uppercase"
      >
        <Button variant="primary" className="w-full">
          + New Classification
        </Button>
      </Link>

      {/* Navigation */}
      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center justify-center md:justify-start gap-2 rounded px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-white text-onBackground shadow-md shadow-gray-300/40"
                  : "text-[#474747] hover:bg-surfaceHigh"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
