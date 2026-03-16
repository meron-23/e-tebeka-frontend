"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Clock, Tag, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ searchesLeft: 5 });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/documents/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query) return;

    setIsLoading(true);
    try {
      let url = `/documents/search?q=${query}`;
      if (selectedCategory) {
        url += `&category_id=${selectedCategory}`;
      }
      const response = await api.get(url);
      setResults(response.data.results);
      if (response.data.searches_left !== undefined) {
        setStats({ searchesLeft: response.data.searches_left });
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 429) {
        setStats({ searchesLeft: 0 });
        alert("Daily search limit reached. Please register or log in for unlimited legal research.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 font-outfit">Legal Search</h1>
        <p className="mt-2 text-slate-600">Find proclamations, regulations, and legal articles.</p>

        <div className="mx-auto mt-4 flex max-w-fit items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
          <Clock className="h-3 w-3" />
          {stats.searchesLeft} searches remaining today
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg font-medium shadow-sm"
            placeholder="Search by keyword, number, or title..."
          />
          <div className="absolute inset-y-2 right-2 flex items-center gap-2">
            <div className="relative group/filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden sm:flex h-12 items-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors appearance-none cursor-pointer pr-10"
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_en}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </button>
          </div>
        </div>
      </form>

      {/* Results Section */}
      <div className="mt-16 space-y-6">
        {results.length > 0 ? (
          results.map((doc: any, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md hover:border-indigo-200 transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                      {doc.document_type}
                    </span>
                    <span className="text-xs text-slate-400">#{doc.document_number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {doc.title_en}
                  </h3>
                  <p className="text-sm text-slate-500 font-amharic">{doc.title_am}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Details
                  </Link>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 group-hover:bg-slate-50 transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-500">
                  <Clock className="h-3 w-3" /> {doc.year_gregorian}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-500">
                  <Tag className="h-3 w-3" /> New
                </span>
              </div>
            </motion.div>
          ))
        ) : query && !isLoading ? (
          <div className="text-center py-20 grayscale opacity-50">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p className="text-gray-400">No documents found for "{query}"</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
