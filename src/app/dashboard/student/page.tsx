"use client";

import { useState, useEffect } from "react";
import { Book, Bookmark, CheckCircle, Clock, GraduationCap, ChevronRight, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api/client";
import { useSession } from "@/components/SessionProvider";
import { getWelcomeName } from "@/lib/session";

interface RecentSearch {
  id: string;
  query: string;
  searched_at: string;
  result_count: number;
}

export default function StudentDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState({
    verificationStatus: "Loading...",
    savedItems: 0,
    searchesToday: 0,
    maxSearches: 100
  });
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const welcomeName = getWelcomeName(user);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch user stats
        const statsRes = await api.get(`/users/me/stats?t=${Date.now()}`);
        const userData = statsRes.data;
        
        // Fetch user info for verification status
        const userRes = await api.get("/users/me");
        const userInfo = userRes.data;
        
        setStats({
          verificationStatus: userInfo.profile?.verification_status || "pending",
          savedItems: 0, // Will be updated by bookmarks count
          searchesToday: userData.searches_today || 0,
          maxSearches: userData.search_limit || 100
        });

        // Fetch recent search history
        try {
          const historyRes = await api.get(`/users/me/history?limit=5&t=${Date.now()}`);
          setRecentSearches(historyRes.data || []);
        } catch {
          console.log("No search history available");
          setRecentSearches([]);
        }

        // Fetch bookmarks count
        try {
          const bookmarksRes = await api.get("/users/me/bookmarks");
          const bookmarks = bookmarksRes.data || [];
          setStats(prev => ({ ...prev, savedItems: bookmarks.length }));
        } catch {
          console.log("No bookmarks available");
        }
      } catch (err: unknown) {
        const isAuthError = typeof err === 'object' && err !== null && 'response' in err && (err as any).response?.status === 401;
        if (!isAuthError) {
          console.error("Failed to fetch student data:", err);
        }
        // Set fallback values
        setStats({
          verificationStatus: "pending",
          savedItems: 0,
          searchesToday: 0,
          maxSearches: 100
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Student Portal</h1>
            <p className="text-slate-600">Welcome, {welcomeName}. Ready for some research?</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={cn(
            "flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold border",
            stats.verificationStatus === "verified" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
            stats.verificationStatus === "rejected" ? "bg-red-50 border-red-100 text-red-700" :
            "bg-amber-50 border-amber-100 text-amber-700"
          )}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 
             stats.verificationStatus === "verified" ? <CheckCircle className="h-4 w-4" /> :
             <Clock className="h-4 w-4" />}
            {loading ? "Loading..." :
             stats.verificationStatus === "verified" ? "Verified Student" :
             stats.verificationStatus === "rejected" ? "Verification Rejected" :
             "Verification Pending"}
          </div>
        </div>
      </div>

      {/* Platform Info Card */}
      <div className="rounded-3xl border border-teal-100 bg-teal-50/50 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-teal-900 mb-2">Academic Research Access</h3>
          <p className="text-sm text-teal-700 leading-relaxed">
            As a verified student, you have full access to the E-Tebeka legal repository. Browse proclamations, search legal keywords, and save important materials for your studies.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-white rounded-2xl p-4 border border-teal-100 shadow-sm min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</p>
            <p className="text-sm font-bold text-emerald-600">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 
               stats.verificationStatus === "verified" ? "Active" : "Limited"}
            </p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-teal-100 shadow-sm min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Searches</p>
            <p className="text-sm font-bold text-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 
               `${stats.searchesToday}/${stats.maxSearches === -1 ? "Unlimited" : stats.maxSearches}`}
            </p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-teal-100 shadow-sm min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Saved</p>
            <p className="text-sm font-bold text-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : stats.savedItems}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Research</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="space-y-4">
              {recentSearches.map((search) => (
                <Link
                  key={search.id}
                  href={`/search?q=${encodeURIComponent(search.query)}`}
                  className="group relative block rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Search className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {search.query}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {new Date(search.searched_at).toLocaleDateString()} • {search.result_count} results
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No recent searches found. Start researching to see your history here.
            </div>
          )}
          <Link href="/search" className="block text-center text-sm font-bold text-teal-600 hover:text-teal-700">
            View Research History
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Study Tools</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/student/research" className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100">
                <Book className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="font-bold text-slate-900">Compare Laws</h4>
              <p className="text-xs text-slate-500">Analyze amendments.</p>
            </Link>
            <Link href="/dashboard/student/saved" className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 hover:border-emerald-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100">
                <Bookmark className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900">My Library</h4>
              <p className="text-xs text-slate-500">Saved articles & notes.</p>
            </Link>
          </div>

          <div className="rounded-3xl bg-teal-50 border border-teal-100 p-8">
            <h4 className="font-bold text-teal-900 mb-2">Did you know?</h4>
            <p className="text-sm text-teal-700 leading-relaxed">
              You can add personal study notes to any article. They remain private and accessible only from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
