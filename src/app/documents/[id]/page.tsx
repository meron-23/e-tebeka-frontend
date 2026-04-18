"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, Bookmark, Share2, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface BookmarkRow {
  document_id: string;
}

interface DocumentSection {
  id: string;
  section_number: string;
  section_number_am?: string;
  title_en: string;
  title_am?: string;
  content_en?: string;
  content_am?: string;
}

interface DocumentRecord {
  document_type: string;
  document_number: string;
  title_en: string;
  title_am?: string;
  pdf_url?: string;
  year_gregorian?: string | number;
  year_ec?: string | number;
  issuing_body_en?: string;
  status?: string;
}

interface DocumentResponse {
  document: DocumentRecord;
  sections: DocumentSection[];
}

function getResponseStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as { response?: { status?: number } }).response?.status;
  }

  return undefined;
}

export default function DocumentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<DocumentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await api.get(`/documents/${id}`);
        setData(response.data);
        
        // Check if document is bookmarked
        try {
          const bookmarksResponse = await api.get("/users/me/bookmarks");
          const bookmarks = (bookmarksResponse.data || []) as BookmarkRow[];
          const isDocBookmarked = bookmarks.some((bookmark) => bookmark.document_id === id);
          setIsBookmarked(isDocBookmarked);
        } catch {
          // User might not be logged in, ignore bookmark check
          console.log("Could not check bookmarks (user not logged in)");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleDownload = async () => {
    if (!data?.document?.pdf_url) {
      alert("PDF not available for this document");
      return;
    }
    
    setIsDownloading(true);
    try {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/${data.document.pdf_url}`;
      window.open(pdfUrl, '_blank');
    } catch (err) {
      console.error("Failed to download PDF:", err);
      alert("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await api.delete(`/users/me/bookmarks/${id}`);
        setIsBookmarked(false);
        alert("Document removed from bookmarks");
      } else {
        await api.post("/users/me/bookmarks", { document_id: id });
        setIsBookmarked(true);
        alert("Document added to bookmarks");
      }
    } catch (err: unknown) {
      console.error("Bookmark operation failed:", err);
      if (getResponseStatus(err) === 401) {
        alert("Please log in to bookmark documents");
      } else {
        alert("Failed to update bookmark");
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.document?.title_en || "Legal Document",
          text: `Check out this legal document: ${data?.document?.title_en}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        // Fallback: show URL in alert
        prompt("Copy this link to share:", shareUrl);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!data) return <div>Document not found</div>;

  const { document, sections } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/search" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Header & Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-600 ring-1 ring-inset ring-teal-500/20">
                {document.document_type}
              </span>
              <span className="text-sm text-slate-500 font-mono">ID: {document.document_number}</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 font-outfit leading-tight lg:text-5xl">
              {document.title_en}
            </h1>
            <p className="text-xl text-slate-600 font-amharic">{document.title_am}</p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-4 border-y border-slate-100 py-6">
            <button 
              onClick={handleDownload}
              disabled={isDownloading || !data?.document?.pdf_url}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
              {isDownloading ? "Loading..." : "Download PDF"}
            </button>
            <button 
              onClick={handleBookmark}
              className={cn(
                "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold ring-1 ring-inset transition-all",
                isBookmarked 
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100 hover:bg-emerald-100" 
                  : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} /> 
              {isBookmarked ? "Bookmarked" : "Save Article"}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {/* Articles/Sections */}
          <div className="space-y-12 pb-24">
            {sections.map((section) => (
              <div key={section.id} className="group scroll-mt-24" id={`sec-${section.section_number}`}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-2xl font-black text-teal-500/40 font-mono">
                    {section.section_number_am || section.section_number}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                      {section.title_en}
                    </h3>
                    <p className="text-sm text-slate-500 font-amharic">{section.title_am}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-12 border-l-2 border-slate-100 hover:border-teal-500/20 transition-colors">
                  <div className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {section.content_en}
                  </div>
                  <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {section.content_am}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Metadata</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Year (Gregorian)</span>
                <span className="text-slate-900 font-medium">{document.year_gregorian}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Year (EC)</span>
                <span className="text-slate-900 font-medium">{document.year_ec}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Issuing Body</span>
                <span className="text-slate-900 font-medium text-right">{document.issuing_body_en}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Status</span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {document.status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Navigation</h4>
            <div className="space-y-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#sec-${s.section_number}`}
                  className="flex items-center justify-between text-xs text-slate-500 hover:text-teal-600 hover:bg-slate-50 p-2 rounded-lg transition-all"
                >
                  <span className="truncate max-w-[180px]">Article {s.section_number}: {s.title_en}</span>
                  <ChevronRight className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
