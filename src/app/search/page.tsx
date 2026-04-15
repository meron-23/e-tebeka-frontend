"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Clock, Tag, ChevronRight, Loader2, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api/client";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ searchesLeft: 5 });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await api.get("/documents/categories");
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }

      // Fetch user stats to get accurate remaining searches before first search
      try {
        const statsRes = await api.get(`/users/me/stats?t=${Date.now()}`);
        const remaining = Math.max(0, statsRes.data.search_limit - statsRes.data.searches_today);
        setStats({ searchesLeft: remaining });
      } catch (err: any) {
        // If 401 (unauthenticated), user is anonymous - set default limit
        if (err.response?.status === 401) {
          setStats({ searchesLeft: 5 }); // Default for anonymous users
        } else {
          console.error("Could not fetch user stats, using default bounds");
        }
      }
    };
    fetchInitialData();
    
    // Refresh stats when page gets focus
    const handleFocus = () => {
      api.get(`/users/me/stats?t=${Date.now()}`)
        .then(statsRes => {
          const remaining = Math.max(0, statsRes.data.search_limit - statsRes.data.searches_today);
          setStats({ searchesLeft: remaining });
        })
        .catch(err => {
          if (err.response?.status === 401) {
            console.log("User is anonymous, using backend search count");
          } else {
            console.error("Could not refresh user stats on focus");
          }
        });
    };
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Debounced search for live results
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      let url = `/documents/search?q=${query}`;
      if (selectedCategory) {
        url += `&category_id=${selectedCategory}`;
      }
      const response = await api.get(url);
      setResults(response.data.results);
      if (response.data.searches_left !== undefined) {
        const sl = response.data.searches_left;
        setStats({ searchesLeft: sl });
      }
      
      // Refetch user stats to ensure we have the latest data
      try {
        const statsRes = await api.get(`/users/me/stats?t=${Date.now()}`);
        const remaining = Math.max(0, statsRes.data.search_limit - statsRes.data.searches_today);
        setStats({ searchesLeft: remaining });
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Anonymous user, using backend search count");
        } else {
          console.error("Could not refresh user stats after search");
        }
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Search Legal Documents
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Search through thousands of Ethiopian proclamations, regulations, and court decisions
            </motion.p>
          </div>

          {/* Search Stats */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 rounded-full text-teal-700 text-sm font-medium">
              <Clock className="h-4 w-4 mr-2" />
              {stats.searchesLeft === -1 ? "Unlimited searches" : `${stats.searchesLeft} searches remaining today`}
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search proclamations, regulations, or keywords..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name_en}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-6 text-sm"
          >
            <Link href="/search?q=proclamation" className="text-teal-600 hover:text-teal-700 font-medium">
              Proclamations
            </Link>
            <Link href="/search?q=regulation" className="text-teal-600 hover:text-teal-700 font-medium">
              Regulations
            </Link>
            <Link href="/search?q=court" className="text-teal-600 hover:text-teal-700 font-medium">
              Court Decisions
            </Link>
            <Link href="/search?q=tax" className="text-teal-600 hover:text-teal-700 font-medium">
              Tax Laws
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {results.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {results.length} Results Found
                </h2>
                <div className="text-gray-600">
                  Showing Ethiopian legal documents
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((doc: any, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Document Type Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc.document_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{doc.document_number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                      {doc.title_en}
                    </h3>
                    
                    {/* Amharic Title */}
                    <p className="text-sm text-gray-600 mb-4 font-amharic">
                      {doc.title_am}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {doc.year_gregorian}
                      </div>
                      {doc.is_new && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <Tag className="h-3 w-3" />
                          New
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/documents/${doc.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      <BookOpen className="h-4 w-4" />
                      View Document
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : isLoading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16">
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
              </div>
              <p className="mt-4 text-gray-600">Searching documents...</p>
            </div>
          ) : query && hasSearched ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No documents found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your search terms or browse categories</p>
              <Link
                href="/#service-categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                <FileText className="h-4 w-4" />
                Browse Categories
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-teal-100 rounded-full">
                  <Search className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h3>
                <p className="text-gray-600 mb-8">
                  Enter keywords to search through Ethiopia's comprehensive legal database
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/#service-categories"
                    className="flex items-center gap-2 px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    Browse Categories
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Register Account
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
