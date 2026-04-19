"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Search, Filter, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/client";

interface Document {
  id: string;
  title_en: string;
  title_am: string;
  document_number: string;
  document_type: string;
  year_gregorian: number;
  pdf_url?: string;
}

export default function LawyerLibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("/documents");
        setDocuments(response.data || []);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.document_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || doc.document_type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (doc: Document) => {
    if (doc.pdf_url) {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/${doc.pdf_url}`;
      window.open(pdfUrl, '_blank');
    } else {
      alert("PDF not available for this document");
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-outfit">Full Library Browser</h1>
          <p className="text-slate-600">Access and download any proclamation or regulation in high-quality PDF.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or document number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">All Types</option>
                <option value="proclamation">Proclamations</option>
                <option value="regulation">Regulations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                  {doc.document_type}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{doc.title_en}</h3>
              <p className="text-sm text-slate-600 mb-4 font-amharic line-clamp-2">{doc.title_am}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>#{doc.document_number}</span>
                <span>{doc.year_gregorian}</span>
              </div>
              
              <button
                onClick={() => handleDownload(doc)}
                disabled={!doc.pdf_url}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {doc.pdf_url ? "Download PDF" : "PDF Unavailable"}
              </button>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No documents found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
