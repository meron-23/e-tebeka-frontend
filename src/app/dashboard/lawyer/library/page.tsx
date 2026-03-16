"use client";

import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlaceholderPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto mb-8">
                    <Construction className="h-10 w-10 text-amber-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">Library Browser</h1>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Access and download any proclamation in high-quality PDF. Feature coming soon.
                </p>
                <Link
                    href="/dashboard/lawyer"
                    className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
