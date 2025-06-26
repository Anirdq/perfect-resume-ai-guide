
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GlassNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Resume Optimizer", href: "/resume" },
    { name: "Why Choose Us", href: "/service-provider" },
    { name: "Pricing", href: "/pricing" },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => handleNavigation("/")}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ResumeAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(item.href) ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-32 truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => handleNavigation("/auth")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-200">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation("/auth")}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GlassNavbar;
