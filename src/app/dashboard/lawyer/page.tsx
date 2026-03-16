"use client";

import { useState } from "react";
import { Gavel, Bookmark, Download, Shield, FileSearch, Filter, Plus, ChevronRight, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LawyerDashboard() {
  const [stats] = useState({
    subscriptionStatus: "Active Pro"
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Gavel className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Lawyer's Suite</h1>
            <p className="text-slate-600">Professional practice dashboard.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
            <Shield className="h-4 w-4" />
            {stats.subscriptionStatus}
          </div>
          <button className="rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white border border-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20">
            <Plus className="h-4 w-4" /> New Case File
          </button>
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
            <p className="text-sm font-bold text-slate-900">Unlimited</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-amber-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Security</p>
            <p className="text-sm font-bold text-emerald-600">Encrypted</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practice Tools */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" /> Professional Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/lawyer/library" className="group rounded-3xl border border-slate-200 bg-white p-6 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100">
                  <FileSearch className="h-5 w-5 text-indigo-600" />
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
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <Download className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Downloaded Proclamation 1234/2021</p>
                      <p className="text-[10px] text-slate-500">3 hours ago • 1.2 MB</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Re-download</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
              <Gavel className="h-40 w-40" />
            </div>
            <h3 className="text-2xl font-bold font-outfit mb-2">Practice Notes</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Add confidential practice notes to any legal section. These are encrypted and accessible only by you.
            </p>
            <button className="w-full rounded-xl bg-white/20 backdrop-blur-lg px-4 py-2 text-sm font-bold hover:bg-white/30 transition-all">
              Access Global Notes
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Subscription</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Next Billing Date</span>
                <span className="text-slate-900 font-medium">April 12, 2026</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Monthly Cost</span>
                <span className="text-slate-900 font-medium">$19.99</span>
              </div>
              <button className="w-full mt-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Manage Billing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
