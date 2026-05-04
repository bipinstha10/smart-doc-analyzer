import { Upload, History, LogOut, Settings, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../store/authSlice";

import Button from "../common/Button";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Define nav items once
  const navItems = [
    { label: "Upload", href: "/dashboard", icon: Upload },
    { label: "History", href: "/history", icon: History },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/", { replace: true });
  };

  const handleSettings = () => {
    // TODO: Implement settings navigation
    console.log("Opening settings...");
    setIsMenuOpen(false);
  };

  return (
    <aside className="px-4 py-8 flex flex-col h-screen">
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-semibold text-onBackground">
        DocCat+
      </Link>

      {/* Workspace info */}
      {/* <p className="mt-2 font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
        Workspace / Personal
      </p> */}

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
              className={`flex items-center justify-center md:justify-start gap-2 rounded px-4 py-2 text-sm transition-all duration-100 ${
                isActive
                  ? "bg-white text-onBackground shadow-md shadow-gray-300/40"
                  : "text-[#474747] hover:bg-[#E8E8E8]"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Menu at the bottom */}
      <div className="mt-auto relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full cursor-pointer border border-[#E8E8E8] flex items-center justify-center md:justify-start gap-2 rounded px-4 py-2 text-sm text-[#474747] hover:bg-[#E8E8E8] transition-colors"
        >
          <User size={18} />
          <span className="hidden md:inline">Menu</span>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={handleSettings}
              className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
            <div className="border-t border-gray-200"></div>
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
