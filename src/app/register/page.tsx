"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { UserPlus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name required"),
  phone: z.string().optional(),
  tier: z.enum(["A", "B", "C"]),
  university: z.string().optional(),
  student_id: z.string().optional(),
  bar_number: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

// Move the main component logic to a separate inner component
function RegisterFormContent() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTier = (searchParams.get("tier") as "A" | "B" | "C") || "C";

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { tier: initialTier },
  });

  const selectedTier = watch("tier");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", data);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
          <h2 className="text-3xl font-bold text-slate-900">Registration Successful!</h2>
          <p className="text-slate-500">Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-20 pb-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl xl:p-10"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 mb-4">
            <UserPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">Join the digital legal repository of Ethiopia.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tier Selection */}
          <div className="grid grid-cols-3 gap-4">
            {["C", "B", "A"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue("tier", t as any)}
                className={cn(
                  "rounded-xl border p-4 text-center transition-all",
                  selectedTier === t 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md" 
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className="block text-lg font-bold">Tier {t}</span>
                <span className="text-[10px] uppercase opacity-70">
                  {t === "C" ? "Public" : t === "B" ? "Student" : "Lawyer"}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                {...register("full_name")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                placeholder="John Doe"
              />
              {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                {...register("email")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone (Optional)</label>
              <input
                {...register("phone")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                placeholder="+251 ..."
              />
            </div>

            {selectedTier === "B" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">University</label>
                  <input
                    {...register("university")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Student ID Number</label>
                  <input
                    {...register("student_id")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </>
            )}

            {selectedTier === "A" && (
              <div className="col-span-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">Bar Number</label>
                <input
                  {...register("bar_number")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 transition-all font-medium"
                  placeholder="L-..."
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Registration"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-4 decoration-indigo-600/30 hover:decoration-indigo-600">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading registration form...</p>
        </div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
