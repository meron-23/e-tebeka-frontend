"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import api from "@/lib/api/client";
import Link from "next/link";

interface Verification {
  id: string;
  user_id: string;
  student_id_number: string;
  university: string;
  status: string;
  submitted_at: string;
  document_path: string;
}

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/admin/verifications")
      .then((r) => setItems(r.data))
      .catch(() => setError("Failed to load verifications. Ensure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: "verified" | "rejected") => {
    try {
      await api.patch(`/admin/verifications/${id}`, { status });
      setItems((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    } catch {
      alert("Failed to update verification.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Link href="/admin" className="text-xs text-indigo-600 hover:underline mb-2 block">← Admin Dashboard</Link>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit">Student Verifications</h1>
          <p className="text-slate-600 mt-1">Review and approve student ID verification requests.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600 text-sm">{error}</div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-left text-xs uppercase tracking-widest">
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">University</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-mono font-medium">{v.student_id_number}</td>
                    <td className="px-6 py-4 text-slate-500">{v.university}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${v.status === "verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : v.status === "rejected"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(v.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {v.document_path && (
                        <a
                          href={`http://localhost:8000${v.document_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                        >
                          <Eye className="h-3 w-3" /> View
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {v.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(v.id, "verified")}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => updateStatus(v.id, "rejected")}
                            className="flex items-center gap-1 rounded-lg bg-red-50 border border-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-sm">No verification requests found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
