"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, ChevronRight, Loader2, Filter, Gavel, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface DocumentListItem {
  id: string;
  document_type: string;
  document_number: string;
  status?: string;
  title_en: string;
  title_am?: string;
  year_gregorian?: number;
}

const DOC_TYPES = [
  { value: "", label: "All Types", icon: <FileText className="h-4 w-4" /> },
  { value: "proclamation", label: "Proclamations", icon: <Gavel className="h-4 w-4" /> },
  { value: "regulation", label: "Regulations", icon: <BookOpen className="h-4 w-4" /> },
];

export default function BrowsePage() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [docType, setDocType] = useState("");
  const [page, setPage] = useState(0);

  const fetchDocuments = async (type: string, skip: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ skip: String(skip), limit: "20" });
      if (type) params.set("doc_type", type);
      const response = await api.get(`/documents/?${params}`);
      setDocuments(response.data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(docType, page * 20);
  }, [docType, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-900 font-outfit"
        >
          Browse Legal Documents
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-slate-600"
        >
          Explore the complete repository of Ethiopian proclamations and regulations.
        </motion.p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Filter className="h-4 w-4 text-slate-400" />
        {DOC_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => { setDocType(t.value); setPage(0); }}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              docType === t.value
                ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-32 opacity-50">
          <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-900">No documents available yet.</p>
          <p className="text-sm text-slate-500 mt-1">Documents will appear here once uploaded by an admin.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {documents.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                        {doc.document_type}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">#{doc.document_number}</span>
                      {doc.status === "active" && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-tight">
                      {doc.title_en}
                    </h3>
                    {doc.title_am && (
                      <p className="text-sm text-slate-600 font-amharic">{doc.title_am}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {doc.year_gregorian && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {doc.year_gregorian}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/10 transition-all active:scale-95"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Details
                    <ChevronRight className="h-3 w-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!isLoading && documents.length > 0 && (
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <span className="text-sm text-slate-500">Page {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={documents.length < 20}
            className="rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
