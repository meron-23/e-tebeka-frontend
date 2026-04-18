"use client";

import { useState, useEffect } from "react";
import { FileText, ArrowLeft, Search, Filter, Loader2, BookOpen, Scale } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/client";

interface Document {
  id: string;
  title_en: string;
  title_am: string;
  document_number: string;
  document_type: string;
  year_gregorian: number;
  categories?: string[];
}

export default function StudentResearchPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const matchesCategory = !selectedCategory || doc.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId].slice(0, 2)
    );
    setShowComparison(false);
  };

  const handleCompare = () => {
    if (selectedDocs.length === 2) {
      setShowComparison(true);
    }
  };

  const comparisonDocuments = selectedDocs
    .map((docId) => documents.find((doc) => doc.id === docId))
    .filter(Boolean) as Document[];

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
          <Link href="/dashboard/student" className="text-xs text-teal-600 hover:underline mb-2 block inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-outfit">Compare Laws</h1>
          <p className="text-slate-600">Analyze amendments and compare legal documents side by side.</p>
        </div>

        {/* Comparison Bar */}
        {selectedDocs.length > 0 && (
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Scale className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium text-teal-900">
                  {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected for comparison
                </span>
              </div>
              <button
                onClick={handleCompare}
                disabled={selectedDocs.length !== 2}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare {selectedDocs.length === 2 ? 'Now' : `(Select 2)`}
              </button>
            </div>
          </div>
        )}

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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">All Categories</option>
                <option value="Labor">Labor</option>
                <option value="Commercial">Commercial</option>
                <option value="Criminal">Criminal</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className={`bg-white rounded-2xl border-2 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                selectedDocs.includes(doc.id) ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
              }`}
              onClick={() => toggleDocumentSelection(doc.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedDocs.includes(doc.id) 
                    ? 'bg-teal-600 border-teal-600' 
                    : 'border-slate-300'
                }`}>
                  {selectedDocs.includes(doc.id) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{doc.title_en}</h3>
              <p className="text-sm text-slate-600 mb-4 font-amharic line-clamp-2">{doc.title_am}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>#{doc.document_number}</span>
                <span>{doc.year_gregorian}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {doc.categories?.slice(0, 2).map((category, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No documents found matching your criteria.</p>
          </div>
        )}

        {showComparison && comparisonDocuments.length === 2 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Comparison Summary</h2>
                <p className="text-sm text-slate-500">Review the key metadata for the two selected legal documents.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowComparison(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close Comparison
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {comparisonDocuments.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">{doc.title_en}</h3>
                  <p className="mt-1 text-sm text-slate-600 font-amharic">{doc.title_am || "No Amharic title available"}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between gap-4">
                      <span>Document Number</span>
                      <span className="font-semibold text-slate-900">#{doc.document_number}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Type</span>
                      <span className="font-semibold capitalize text-slate-900">{doc.document_type}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Year</span>
                      <span className="font-semibold text-slate-900">{doc.year_gregorian}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(doc.categories || []).length > 0 ? (
                      doc.categories?.map((category) => (
                        <span key={`${doc.id}-${category}`} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                          {category}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No categories attached</span>
                    )}
                  </div>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    <FileText className="h-4 w-4" />
                    Open Document
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDocs.length === 0 && (
          <div className="text-center py-8 mt-8">
            <p className="text-sm text-slate-500">
              Select up to 2 documents to compare their content and amendments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
