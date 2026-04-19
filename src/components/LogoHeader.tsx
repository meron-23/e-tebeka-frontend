"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useSession } from "@/components/SessionProvider";
import {
  getDashboardPath,
  getUserRoleLabel,
  getWelcomeName,
} from "@/lib/session";

export default function LogoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useSession();
  const welcomeName = getWelcomeName(user);
  const dashboardHref = getDashboardPath(user);
  const roleLabel = getUserRoleLabel(user);
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/admin");
  const isSignedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="hidden h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700"
                    style={{ display: "none" }}
                  >
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

          <nav className="hidden md:flex items-center space-x-8">
            {!isSignedIn && (
              <>
                <Link href="/#service-categories" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  Services
                </Link>
                <Link href="/search" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  Search
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  About
                </Link>
              </>
            )}
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                    <User className="h-4 w-4 text-teal-700" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-teal-700">{roleLabel}</p>
                    <p className="text-sm font-medium text-slate-700">Welcome, {welcomeName}</p>
                  </div>
                </div>
                {!isAuthPage && (
                  <Link
                    href={dashboardHref}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/register" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  Register
                </Link>
                <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Sign In
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="text-gray-700 hover:text-teal-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full border-b border-gray-200 py-4 px-4 shadow-lg z-50 overflow-y-auto max-h-[calc(100vh-4rem)] ${isSignedIn || isAdminRoute ? 'bg-white' : 'bg-white/95 backdrop-blur-md'}`}>
          <div className="flex flex-col space-y-4">
            {!isSignedIn && (
              <div className="flex flex-col gap-3 pb-2 border-b border-gray-100">
                <Link href="/#service-categories" className="text-gray-700 hover:text-teal-600 font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                  Services
                </Link>
                <Link href="/search" className="text-gray-700 hover:text-teal-600 font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                  Search
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-teal-600 font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </div>
            )}
            
            {isSignedIn ? (
              <div className="flex flex-col space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mx-auto w-full">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 shrink-0">
                      <User className="h-4 w-4 text-teal-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-teal-700 truncate">{roleLabel}</p>
                      <p className="text-sm font-medium text-gray-700 truncate">Welcome, {welcomeName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {!isAuthPage && (
                    <Link
                      href={dashboardHref}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center font-bold text-gray-700 hover:bg-slate-50 shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await logout();
                    }}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center font-bold text-red-600 hover:bg-red-100 shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/register" className="text-gray-700 hover:text-slate-900 border border-slate-200 text-center rounded-xl bg-white font-medium px-4 py-3 shadow-sm hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
                <Link href="/login" className="bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 text-center font-semibold shadow-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
