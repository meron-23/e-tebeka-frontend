"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionProvider";
import api from "@/lib/api/client";
import { getDashboardPath, isApprovedStudent } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isLoading: isSessionLoading, setAuthenticatedSession } = useSession();

  useEffect(() => {
    if (!isSessionLoading && user) {
      router.replace(getDashboardPath(user));
    }
  }, [isSessionLoading, router, user]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      const { access_token, user } = response.data;

      if (user.tier === "B" && !isApprovedStudent(user)) {
        setError("Your student account is waiting for admin approval. Please check your email after approval and sign in again.");
        return;
      }

      setAuthenticatedSession(access_token, user);
      router.replace(getDashboardPath(user));
      router.refresh();
    } catch (err: unknown) {
      const detail =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      setError(detail || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl xl:p-10"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 mb-4">
            <LogIn className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-600">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              {...register("email")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all font-medium"
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all font-medium"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-500 underline underline-offset-4 decoration-teal-600/30 hover:decoration-teal-600">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
