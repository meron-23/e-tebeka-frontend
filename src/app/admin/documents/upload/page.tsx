"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle, FileText, Settings, AlertCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [geminiData, setGeminiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/admin/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJobId(response.data.job_id);
    } catch (err: any) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (!jobId) return;

    setIsProcessing(true);
    setError(null);
    try {
      const response = await api.post(`/admin/documents/process-gemini/${jobId}`);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setGeminiData(response.data);
      }
    } catch (err: any) {
      setError("AI processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!jobId || !geminiData) return;
    try {
      await api.post(`/admin/documents/confirm-upload/${jobId}`, geminiData);
      alert("Document published successfully!");
      setFile(null);
      setJobId(null);
      setGeminiData(null);
    } catch (err) {
      alert("Failed to confirm upload.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit">Document Management</h1>
          <p className="mt-2 text-slate-600">Upload new legal documents and process with Gemini AI.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-indigo-600">Admin Status</span>
            <span className="text-sm text-slate-900 font-medium">System Operator</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" /> 1. Upload PDF Gazette
          </h2>

          <div className="space-y-6">
            <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center transition-all hover:border-indigo-200 group/drop">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4 group-hover/drop:text-indigo-400 transition-colors" />
              <p className="text-slate-900 font-medium">
                {file ? file.name : "Click or drag to upload PDF"}
              </p>
              <p className="mt-2 text-xs text-slate-500">Maximum size 10MB</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {!jobId ? (
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Upload"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> File uploaded successfully
                </div>
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze with Gemini AI"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" /> 2. Preview & Verify
          </h2>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Gemini AI is parsing the document...</p>
            </div>
          ) : geminiData ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Document Type</span>
                  <select
                    value={geminiData.document_type}
                    onChange={(e) => setGeminiData({ ...geminiData, document_type: e.target.value })}
                    className="bg-transparent border-none text-right text-sm text-slate-900 font-bold outline-none"
                  >
                    <option value="proclamation">Proclamation</option>
                    <option value="regulation">Regulation</option>
                  </select>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Number</span>
                  <input
                    value={geminiData.document_number || ""}
                    onChange={(e) => setGeminiData({ ...geminiData, document_number: e.target.value })}
                    className="bg-transparent border-none text-right text-sm text-slate-900 font-bold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">English Title</span>
                  <textarea
                    value={geminiData.title_en || ""}
                    onChange={(e) => setGeminiData({ ...geminiData, title_en: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 h-24 outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* Categories Section */}
                <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Categories (AI Suggested)</span>
                  <div className="flex flex-wrap gap-2">
                    {geminiData.categories?.map((cat: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 flex items-center gap-1">
                        {cat}
                        <button
                          onClick={() => {
                            const newCats = geminiData.categories.filter((_: any, idx: number) => idx !== i);
                            setGeminiData({ ...geminiData, categories: newCats });
                          }}
                          className="hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => {
                        const newCat = prompt("Enter new category:");
                        if (newCat) {
                          setGeminiData({ ...geminiData, categories: [...(geminiData.categories || []), newCat] });
                        }
                      }}
                      className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 hover:bg-slate-100"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Sections Found ({geminiData.articles?.length || 0})</p>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {geminiData.articles?.map((art: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-[10px] bg-slate-50 p-2.5 rounded border border-slate-100/50">
                      <span className="text-slate-500 font-medium">Article {art.section_number}</span>
                      <span className="text-slate-900 font-semibold truncate max-w-[200px]">{art.title_en}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
              >
                Confirm & Publish
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-40">
              <FileText className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm font-medium">No analysis results yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
