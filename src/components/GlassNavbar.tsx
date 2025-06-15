
import { Link, useLocation } from "react-router-dom";
import { Brain } from "lucide-react";
import React from "react";
import clsx from "clsx";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Resume Optimization", path: "/resume" },
  { name: "Features", path: "/features" },
  { name: "Why Choose Us", path: "/service-provider" },
  { name: "Pricing", path: "/pricing" },
];

export const GlassNavbar = () => {
  const location = useLocation();
  return (
    <nav
      className="
        fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[95vw] max-w-6xl
        bg-white/30 shadow-xl backdrop-blur-xl
        rounded-2xl flex justify-between items-center px-6 py-3 border border-white/50
      "
      style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center space-x-3">
        <span className="bg-blue-600 p-2 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </span>
        <span className="text-lg font-bold text-gray-900">ResumeAI</span>
      </div>
      <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
        {navLinks.map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-gray-800 font-medium text-base transition-all duration-200 hover:bg-white/40 hover:text-blue-700 focus:outline-none focus:bg-white/50",
              location.pathname === path
                ? "bg-white/60 shadow-md text-blue-700 font-semibold"
                : "bg-transparent"
            )}
            tabIndex={0}
          >
            {name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default GlassNavbar;
