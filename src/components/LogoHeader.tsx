"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User, LogOut, Settings } from "lucide-react";
import api from "@/lib/api/client";

export default function LogoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[Auth] Verifying session. Pathname:', pathname);
      
      // First check cached user for immediate UI update
      if (typeof window !== "undefined") {
        const cachedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        console.log('[Auth] Token present in storage:', !!token);
        
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            console.log('[Auth] Using cached user:', parsedUser.full_name || parsedUser.email);
            setUser(parsedUser);
            setIsLoading(false);
          } catch (e) {
            console.error("[Auth] Failed to parse cached user data");
          }
        }

        if (!token) {
          console.log('[Auth] No token found, resetting user state');
          setUser(null);
          setIsLoading(false);
          return;
        }
      }
      
      try {
        console.log('[Auth] Fetching fresh user data from /users/me...');
        const response = await api.get('/users/me');
        console.log('[Auth] Server response success:', response.data.email);
        setUser(response.data);
        // Sync cache with fresh data from server
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error: any) {
        console.error('[Auth] Server verification failed:', error.message);
        const status = error.response?.status;
        console.log('[Auth] Error status:', status);
        
        // Only clear state if the server explicitly rejects the credentials (401/403)
        if (status === 401 || status === 403) {
          console.warn('[Auth] Session invalid or expired, clearing storage');
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
          setUser(null);
        } else {
          console.warn('[Auth] Server error (non-auth), preserving cached session. Status:', status);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g. from other tabs or local updates)
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
      } else {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state and redirect regardless of API success
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setUser(null);
      window.location.href = '/';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src="/images/federal-supreme-court-logo.jpg" 
                      alt="Federal Supreme Court of Ethiopia"
                      className="h-10 w-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="h-10 w-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-white font-bold text-xs">FSC</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-teal-700">E-Tebeka</span>
                    <span className="block text-xs text-gray-500">Federal Digital Law Library</span>
                  </div>
                </div>
              </Link>
            </div>
            {/* Loading placeholder */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Federal Supreme Court Logo + E-Tebeka */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-3">
                {/* Federal Supreme Court Logo */}
                <div className="relative">
                  <img 
                    src="/images/federal-supreme-court-logo.jpg" 
                    alt="Federal Supreme Court of Ethiopia"
                    className="h-10 w-auto"
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div className="h-10 w-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xs">FSC</span>
                  </div>
                </div>
                <div>
                  <span className="block text-xl font-bold text-teal-700">E-Tebeka</span>
                  <span className="block text-xs text-gray-500">Federal Digital Law Library</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#service-categories" className="text-gray-700 hover:text-teal-600 transition-colors">
              Services
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-teal-600 transition-colors">
              Search
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors">
              About
            </Link>
            
            {user ? (
              <>
                {/* User is logged in - show user menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.full_name}
                    </span>
                  </div>
                  <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* User is not logged in - show auth links */}
                <Link href="/register" className="text-gray-700 hover:text-teal-600 transition-colors">
                  Register
                </Link>
                <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/#service-categories" className="text-gray-700 hover:text-teal-600">
                Services
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-teal-600">
                Search
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-teal-600">
                About
              </Link>
              
              {user ? (
                <>
                  {/* Mobile user menu */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.full_name}
                      </span>
                    </div>
                    <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-red-600 flex items-center gap-1 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile auth links */}
                  <Link href="/register" className="text-gray-700 hover:text-teal-600">
                    Register
                  </Link>
                  <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-center">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
