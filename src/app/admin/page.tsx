"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Upload,
  Users,
  ShieldCheck,
  FileText,
  ArrowRight,
  Clock,
} from "lucide-react";
import api from "@/lib/api/client";
import { useSession } from "@/components/SessionProvider";
import { getWelcomeName } from "@/lib/session";

const adminSections = [
  {
    title: "Document Upload",
    description: "Upload new legal PDF gazettes and publish them with manual metadata review.",
    href: "/admin/documents/upload",
    icon: Upload,
    color: "teal",
    gradient: "from-teal-50 to-white",
    border: "border-teal-100",
    iconBg: "bg-teal-100/50",
    iconColor: "text-teal-600",
    badge: "Core",
  },
  {
    title: "User Management",
    description: "View, activate, suspend or promote registered users.",
    href: "/admin/users",
    icon: Users,
    color: "emerald",
    gradient: "from-emerald-50 to-white",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100/50",
    iconColor: "text-emerald-600",
    badge: "Users",
  },
  {
    title: "Student Verifications",
    description: "Review pending student ID verification requests.",
    href: "/admin/verifications",
    icon: ShieldCheck,
    color: "amber",
    gradient: "from-amber-50 to-white",
    border: "border-amber-100",
    iconBg: "bg-amber-100/50",
    iconColor: "text-amber-600",
    badge: "Pending",
  },
];

export default function AdminDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState({
    totalDocuments: "—",
    totalUsers: "—",
    pendingVerifications: "—",
  });
  const [statsMessage, setStatsMessage] = useState<string | null>(null);
  const welcomeName = getWelcomeName(user) || "Administrator";

  useEffect(() => {
    if (!user?.is_admin) {
      setStatsMessage("Open admin view loaded. Sign in with an admin account to load protected admin statistics and actions.");
      return;
    }

    // Fetch quick stats from backend
    api
      .get("/admin/stats")
      .then((r) => {
        setStats(r.data);
        setStatsMessage(null);
      })
      .catch((err) => {
        const isAuthError = err?.response?.status === 401;
        if (!isAuthError) {
          console.error("Failed to fetch admin stats:", err?.message || "Unknown error");
        }
        setStatsMessage("Admin page opened, but protected statistics could not be loaded right now.");
      });
  }, [user?.is_admin]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-700 mb-6">
            <ShieldCheck className="h-3 w-3" /> Admin Panel
          </div>
          <h1 className="text-5xl font-bold text-slate-900 font-outfit mb-3">
            Welcome, {welcomeName}
          </h1>
          <p className="text-slate-600 text-lg">
            Manage the E-Tebeka Ethiopian Legal Repository platform.
          </p>
          {statsMessage && (
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {statsMessage}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Legal Documents", value: stats.totalDocuments, icon: FileText, color: "text-teal-600" },
            { label: "Registered Users", value: stats.totalUsers, icon: Users, color: "text-emerald-600" },
            { label: "Pending Verifications", value: stats.pendingVerifications, icon: Clock, color: "text-amber-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Icon className={`h-5 w-5 mb-3 ${color}`} />
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminSections.map(
            ({ title, description, href, icon: Icon, border, iconBg, iconColor, badge }) => (
              <Link
                key={href}
                href={href}
                className={`group relative rounded-3xl border ${border} bg-white p-7 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-teal-200`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`rounded-xl ${iconBg} p-3`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${iconColor} bg-white border border-slate-100 rounded-full px-2.5 py-1`}>
                    {badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 font-outfit">{title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{description}</p>
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${iconColor} group-hover:gap-3 transition-all`}>
                  Open <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            )
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 mt-14">
          E-Tebeka Admin Panel · All actions are logged · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
