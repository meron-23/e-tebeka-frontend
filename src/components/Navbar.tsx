"use client";

import Link from "next/link";
import { Scale, LogIn, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    // Re-check on mount and when pathname changes
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            E-Tebeka
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/documents" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Browse
          </Link>
          <Link href="/search" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Search
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          
          {user ? (
            <div className="flex items-center gap-6">
              {user.is_admin ? (
                <Link href="/admin" className="text-sm font-semibold text-indigo-600 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> Admin
                </Link>
              ) : (
                <Link href={user.tier === 'A' ? '/dashboard/lawyer' : user.tier === 'B' ? '/dashboard/student' : '/dashboard/general'} className="text-sm font-semibold text-indigo-600">
                  Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link 
                href="/register" 
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-slate-600 hover:text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/documents" className="text-lg font-medium text-slate-900" onClick={() => setIsOpen(false)}>Browse</Link>
            <Link href="/search" className="text-lg font-medium text-slate-900" onClick={() => setIsOpen(false)}>Search</Link>
            {user ? (
              <>
                {user.is_admin ? (
                  <Link href="/admin" className="text-lg font-bold text-indigo-600" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                ) : (
                  <Link href={user.tier === 'A' ? '/dashboard/lawyer' : user.tier === 'B' ? '/dashboard/student' : '/dashboard/general'} className="text-lg font-bold text-indigo-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
                )}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-lg font-medium text-red-600 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-lg font-medium text-slate-900" onClick={() => setIsOpen(false)}>Login</Link>
                <Link href="/register" className="rounded-xl bg-slate-900 p-3 text-center font-bold text-white" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
