"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionProvider";
import { getDashboardPath } from "@/lib/session";

export default function DashboardRedirectPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(getDashboardPath(user));
  }, [isLoading, router, user]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
        Opening your dashboard...
      </div>
    </div>
  );
}
