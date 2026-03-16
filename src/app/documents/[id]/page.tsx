"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, Bookmark, Share2, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await api.get(`/documents/${id}`);
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!data) return <div>Document not found</div>;

  const { document, sections } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/search" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Header & Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
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
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
              <Download className="h-4 w-4" /> Download PDF
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all">
              <Bookmark className="h-4 w-4" /> Save Article
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {/* Articles/Sections */}
          <div className="space-y-12 pb-24">
            {sections.map((section: any) => (
              <div key={section.id} className="group scroll-mt-24" id={`sec-${section.section_number}`}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-2xl font-black text-indigo-500/40 font-mono">
                    {section.section_number_am || section.section_number}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {section.title_en}
                    </h3>
                    <p className="text-sm text-slate-500 font-amharic">{section.title_am}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-12 border-l-2 border-slate-100 hover:border-indigo-500/20 transition-colors">
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
              {sections.map((s: any) => (
                <a
                  key={s.id}
                  href={`#sec-${s.section_number}`}
                  className="flex items-center justify-between text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-50 p-2 rounded-lg transition-all"
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
