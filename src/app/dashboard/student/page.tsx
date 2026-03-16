"use client";

import { useState, useEffect } from "react";
import { Book, Bookmark, History, FileText, CheckCircle, Clock, GraduationCap, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    verificationStatus: "verified",
    savedItems: 12,
    searchesToday: 45,
    maxSearches: 100
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Student Portal</h1>
            <p className="text-slate-600">Welcome back! Ready for some research?</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={cn(
            "flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold border",
            stats.verificationStatus === "verified" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
          )}>
            <CheckCircle className="h-4 w-4" />
            {stats.verificationStatus === "verified" ? "Verified Student" : "Verification Pending"}
          </div>
        </div>
      </div>

      {/* Platform Info Card */}
      <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-indigo-900 mb-2">Academic Research Access</h3>
          <p className="text-sm text-indigo-700 leading-relaxed">
            As a verified student, you have full access to the E-Tebeka legal repository. Browse proclamations, search legal keywords, and use our AI tools to summarize complex legal text.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</p>
            <p className="text-sm font-bold text-emerald-600">Active</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm min-w-[120px]">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Limit</p>
            <p className="text-sm font-bold text-slate-900">Unlimited</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Research</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative rounded-2xl border border-slate-100 bg-white p-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Labor Proclamation No. 377/2003</h4>
                      <p className="text-xs text-slate-500">Last viewed 2 hours ago</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
                </div>
              </div>
            ))}
          </div>
          <Link href="/search" className="block text-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            View Research History
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Study Tools</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/student/research" className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100">
                <Book className="h-6 w-6 text-indigo-600" />
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

          <div className="rounded-3xl bg-indigo-50 border border-indigo-100 p-8">
            <h4 className="font-bold text-indigo-900 mb-2">Did you know?</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">
              You can add personal study notes to any article. They remain private and accessible only from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
