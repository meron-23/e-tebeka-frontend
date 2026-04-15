"use client";

import { useState, useEffect } from "react";
import { Book, History, Search, Scale, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api/client";

export default function GeneralDashboard() {
  const [stats, setStats] = useState({
    searchesToday: 0,
    maxSearches: 5,
    viewsToday: 0,
    maxViews: 10
  });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get(`/users/me/stats?t=${Date.now()}`),
          api.get(`/users/me/history?t=${Date.now()}`)
        ]);
        
        setStats({
          searchesToday: statsRes.data.searches_today,
          maxSearches: statsRes.data.search_limit,
          viewsToday: statsRes.data.views_today,
          maxViews: statsRes.data.views_limit
        });
        setHistory(historyRes.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    
    // Add a refresh interval to keep data current
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    
    // Also refresh when page gets focus (user navigates back to tab)
    const handleFocus = () => fetchStats();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Citizen Portal</h1>
            <p className="text-slate-600">Welcome to your digital legal access center.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
            General Public Access
          </div>
        </div>
      </div>

      {/* Platform Info Card */}
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Public Legal Research</h3>
          <p className="text-sm text-emerald-700 leading-relaxed">
            As a registered citizen, you have basic access to the E-Tebeka legal repository. Browse recent proclamations, search for specific laws, and stay informed on Ethiopia's legal frameworks.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm min-w-[100px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Searches Left</p>
            <p className="text-sm font-bold text-slate-900">{Math.max(0, stats.maxSearches - stats.searchesToday)}</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm min-w-[100px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Views</p>
            <p className="text-sm font-bold text-slate-900">{stats.viewsToday} / {stats.maxViews}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Searches</h2>
          <div className="space-y-4">
            {history.length > 0 ? history.map((item) => (
              <div key={item.id} className="group relative rounded-2xl border border-slate-100 bg-white p-4 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Search className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{item.query}</h4>
                      <p className="text-xs text-slate-500">Searched recently</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 transition-all" />
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500 text-sm">No recent searches</div>
            )}
          </div>
          <Link href="/search" className="block text-center text-sm font-bold text-emerald-600 hover:text-emerald-700">
            Start New Search
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Explore</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/documents" className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 hover:border-emerald-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100">
                <Book className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900">Browse Laws</h4>
              <p className="text-xs text-slate-500">View latest publications.</p>
            </Link>
            <Link href="/search" className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100">
                <Search className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="font-bold text-slate-900">Search</h4>
              <p className="text-xs text-slate-500">Find specific legal texts.</p>
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
            <h4 className="font-bold text-slate-900 mb-2">Need more access?</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              If you are a student or a legal professional, you can upgrade your account to gain unlimited access, advanced search tools, and PDF downloads.
            </p>
            <Link href="/register" className="text-sm font-bold text-teal-600 hover:text-teal-700">
              Upgrade Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
