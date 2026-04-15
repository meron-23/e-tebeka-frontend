"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Ban, CheckCircle, Loader2 } from "lucide-react";
import api from "@/lib/api/client";
import Link from "next/link";

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  tier: string;
  status: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((r) => setUsers(r.data))
      .catch((err) => {
        console.error("Failed to load users:", err);
        setError("Failed to load users. Ensure you have admin privileges and the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    } catch {
      alert("Failed to update user.");
    }
  };

  const promoteToAdmin = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/admin`);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_admin: true } : u)));
      alert("User promoted to admin successfully!");
    } catch {
      alert("Failed to promote user to admin.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-xs text-teal-600 hover:underline mb-2 block">← Admin Dashboard</Link>
            <h1 className="text-4xl font-bold text-slate-900 font-outfit">User Management</h1>
            <p className="text-slate-600 mt-1">View and manage all registered users.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-700">
            <Users className="h-3 w-3" /> {users.length} users
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600 text-sm">{error}</div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-left text-xs uppercase tracking-widest">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-medium">{user.full_name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-xs text-teal-700">
                        Tier {user.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : user.status === "suspended"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <ShieldCheck className="h-4 w-4 text-teal-600" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {user.status !== "active" && (
                          <button
                            onClick={() => updateStatus(user.id, "active")}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" /> Activate
                          </button>
                        )}
                        {user.status !== "suspended" && !user.is_admin && (
                          <button
                            onClick={() => updateStatus(user.id, "suspended")}
                            className="flex items-center gap-1 rounded-lg bg-red-50 border border-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <Ban className="h-3 w-3" /> Suspend
                          </button>
                        )}
                        {!user.is_admin && (
                          <button
                            onClick={() => promoteToAdmin(user.id)}
                            className="flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-100 px-3 py-1 text-xs text-teal-700 hover:bg-teal-100 transition-colors"
                          >
                            <ShieldCheck className="h-3 w-3" /> Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-sm">No users found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
