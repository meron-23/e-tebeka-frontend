"use client";

import { useState, useEffect } from "react";
import { Bookmark, ExternalLink, ArrowLeft, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/client";

interface BookmarkItem {
  id: string;
  document_id: string;
  title_en: string;
  title_am: string;
  document_number: string;
  created_at: string;
}

export default function LawyerSavedPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await api.get("/users/me/bookmarks");
        setBookmarks(response.data || []);
      } catch (err: any) {
        console.error("Failed to fetch bookmarks:", err);
        if (err.response?.status === 401) {
          // User not logged in
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (documentId: string) => {
    try {
      await api.delete(`/users/me/bookmarks/${documentId}`);
      setBookmarks(prev => prev.filter(b => b.document_id !== documentId));
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
      alert("Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/lawyer" className="text-xs text-teal-600 hover:underline mb-2 block inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-outfit">Case Bookmarks</h1>
          <p className="text-slate-600">Organize saved articles by client or legal case for rapid reference.</p>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Bookmark className="h-5 w-5 text-teal-600 fill-current" />
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.document_id)}
                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{bookmark.title_en}</h3>
                <p className="text-sm text-slate-600 mb-4 font-amharic line-clamp-2">{bookmark.title_am}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>#{bookmark.document_number}</span>
                  <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/documents/${bookmark.document_id}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-20 w-20 rounded-3xl bg-teal-50 flex items-center justify-center mx-auto mb-8">
              <Bookmark className="h-10 w-10 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Bookmarked Documents</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You haven't saved any documents yet. Browse the library and bookmark important documents for quick access.
            </p>
            <Link
              href="/dashboard/lawyer/library"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
            >
              Browse Library
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
