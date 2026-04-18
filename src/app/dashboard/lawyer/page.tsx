"use client";

import { useState, useEffect } from "react";
import { Gavel, Bookmark, Download, Shield, FileSearch, Plus, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/client";
import { useSession } from "@/components/SessionProvider";
import { getWelcomeName } from "@/lib/session";

interface RecentActivity {
  id: string;
  document_title: string;
  document_number: string;
  downloaded_at: string;
  file_size: number;
}

export default function LawyerDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState({
    subscriptionStatus: "Loading...",
    downloadsToday: 0,
    totalDownloads: 0,
    securityStatus: "Encrypted"
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const welcomeName = getWelcomeName(user);

  useEffect(() => {
    const fetchLawyerData = async () => {
      try {
        // Fetch user stats
        const statsRes = await api.get(`/users/me/stats?t=${Date.now()}`);
        const userData = statsRes.data;
        
        setStats({
          subscriptionStatus: userData.tier === "A" ? "Professional Suite" : "Basic Plan",
          downloadsToday: userData.views_today || 0,
          totalDownloads: userData.views_limit || 999999,
          securityStatus: "Encrypted"
        });

        // Fetch recent downloads/activity
        try {
          const activityRes = await api.get(`/users/me/downloads?limit=5&t=${Date.now()}`);
          setRecentActivity(activityRes.data || []);
        } catch {
          console.log("No download history available");
          setRecentActivity([]);
        }
      } catch (err: unknown) {
        const isAuthError = typeof err === 'object' && err !== null && 'response' in err && (err as any).response?.status === 401;
        if (!isAuthError) {
          console.error("Failed to fetch lawyer data:", err);
        }
        setStats({
          subscriptionStatus: "Professional Suite", // Fallback for tier A users
          downloadsToday: 0,
          totalDownloads: 999999,
          securityStatus: "Encrypted"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Gavel className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Lawyer&apos;s Suite</h1>
            <p className="text-slate-600">Welcome, {welcomeName}. Your professional practice dashboard is ready.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
            <Shield className="h-4 w-4" />
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.subscriptionStatus}
          </div>
          <Link href="/dashboard/lawyer/saved" className="rounded-2xl bg-teal-600 px-6 py-2 text-sm font-bold text-white border border-teal-600 hover:bg-teal-700 transition-all flex items-center gap-2 shadow-md shadow-teal-600/20">
            <Plus className="h-4 w-4" /> New Case File
          </Link>
        </div>
      </div>

      {/* Premium Benefits Card */}
      <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div className="max-w-lg">
          <h3 className="text-xl font-bold text-amber-900 mb-2">Professional Suite Active</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Your practitioner account is active. You have full access to high-quality PDF downloads, practice note encryption, and advanced legal search filters.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-white rounded-2xl p-4 border border-amber-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Downloads</p>
            <p className="text-sm font-bold text-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 
               stats.totalDownloads === 999999 ? "Unlimited" : stats.totalDownloads}
            </p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-amber-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Security</p>
            <p className="text-sm font-bold text-emerald-600">{stats.securityStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practice Tools */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal-600" /> Professional Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/lawyer/library" className="group rounded-3xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100">
                  <FileSearch className="h-5 w-5 text-teal-600" />
                </div>
                <h4 className="font-bold text-slate-900">Full Library Browser</h4>
              </div>
              <p className="text-xs text-slate-500">Access and download any proclamation or regulation in high-quality PDF.</p>
            </Link>

            <Link href="/dashboard/lawyer/saved" className="group rounded-3xl border border-slate-200 bg-white p-6 hover:border-amber-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100">
                  <Bookmark className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-900">Case Bookmarks</h4>
              </div>
              <p className="text-xs text-slate-500">Organize saved articles by client or legal case for rapid reference.</p>
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <Download className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Downloaded {activity.document_title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(activity.downloaded_at).toLocaleDateString()} • {(activity.file_size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/lawyer/library"
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      Open Library
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No recent activity found. Start by browsing the library.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-teal-600 p-8 text-white shadow-xl shadow-teal-600/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
              <Gavel className="h-40 w-40" />
            </div>
            <h3 className="text-2xl font-bold font-outfit mb-2">Practice Notes</h3>
            <p className="text-teal-100 text-sm mb-6 leading-relaxed">
              Add confidential practice notes to any legal section. These are encrypted and accessible only by you.
            </p>
            <Link
              href="/dashboard/lawyer/saved"
              className="block w-full rounded-xl bg-white/20 px-4 py-2 text-center text-sm font-bold backdrop-blur-lg hover:bg-white/30 transition-all"
            >
              Open Case Bookmarks
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Subscription</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Plan Type</span>
                <span className="text-slate-900 font-medium">
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : stats.subscriptionStatus}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Downloads Today</span>
                <span className="text-slate-900 font-medium">
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : stats.downloadsToday}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Download Limit</span>
                <span className="text-slate-900 font-medium">
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                   stats.totalDownloads === -1 || stats.totalDownloads === 999999 ? "Unlimited" : stats.totalDownloads}
                </span>
              </div>
              <a
                href="mailto:support@e-tebeka.gov.et?subject=E-Tebeka%20Lawyer%20Subscription"
                className="block w-full mt-2 rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Contact Billing Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
