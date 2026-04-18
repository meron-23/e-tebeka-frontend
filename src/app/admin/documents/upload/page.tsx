"use client";

import { useEffect, useState } from "react";
import { Upload, Loader2, CheckCircle, FileText, Settings, AlertCircle } from "lucide-react";
import api from "@/lib/api/client";

const EMPTY_FORM = {
  document_type: "proclamation",
  document_number: "",
  title_en: "",
  title_am: "",
  year_gregorian: "",
  year_ec: "",
  issuing_body_en: "",
  issuing_body_am: "",
  categories: [] as string[],
  articles: [] as Array<Record<string, unknown>>,
};

interface CategoryOption {
  id?: string | number;
  name?: string;
  name_en?: string;
}

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/documents/categories")
      .then((response) => setAvailableCategories(response.data || []))
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSuccessMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/admin/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJobId(response.data.filename);
      setSuccessMessage("PDF uploaded. Enter the metadata below, then publish the document.");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!jobId) return;

    const normalizedCategories = Array.from(
      new Set(
        [...formData.categories, customCategory.trim()]
          .map((category) => category.trim())
          .filter(Boolean)
      )
    );

    if (!formData.title_en.trim() || !formData.document_number.trim()) {
      setError("Document title and document number are required before publishing.");
      return;
    }

    try {
      await api.post("/admin/documents/create", {
        ...formData,
        pdf_url: jobId,
        categories: normalizedCategories,
      });
      setSuccessMessage("Document published successfully.");
      setFile(null);
      setJobId(null);
      setFormData(EMPTY_FORM);
      setCustomCategory("");
    } catch {
      setError("Failed to publish the uploaded document.");
    }
  };

  const toggleCategory = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(name)
        ? prev.categories.filter((category) => category !== name)
        : [...prev.categories, name],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit">Document Management</h1>
          <p className="mt-2 text-slate-600">Upload new legal documents and publish them after a manual metadata review.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-teal-600">Admin Status</span>
            <span className="text-sm text-slate-900 font-medium">System Operator</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-teal-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Upload className="h-5 w-5 text-teal-600" /> 1. Upload PDF Gazette
          </h2>

          <div className="space-y-6">
            <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center transition-all hover:border-teal-200 group/drop">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4 group-hover/drop:text-teal-400 transition-colors" />
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

            {successMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-700 border border-emerald-100">
                <CheckCircle className="h-4 w-4" /> {successMessage}
              </div>
            )}

            {!jobId ? (
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Upload"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> File uploaded successfully
                </div>
                <p className="text-sm text-slate-500">
                  Continue on the right to enter metadata and publish without external AI processing.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" /> 2. Review & Publish
          </h2>

          {jobId ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Document Type</span>
                  <select
                    value={formData.document_type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, document_type: e.target.value }))}
                    className="bg-transparent border-none text-right text-sm text-slate-900 font-bold outline-none"
                  >
                    <option value="proclamation">Proclamation</option>
                    <option value="regulation">Regulation</option>
                  </select>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Number</span>
                  <input
                    value={formData.document_number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, document_number: e.target.value }))}
                    className="bg-transparent border-none text-right text-sm text-slate-900 font-bold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">English Title</span>
                  <textarea
                    value={formData.title_en}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 h-24 outline-none focus:border-teal-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Amharic Title</span>
                    <textarea
                      value={formData.title_am}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title_am: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 h-24 outline-none focus:border-teal-500 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Gregorian Year</span>
                      <input
                        value={formData.year_gregorian}
                        onChange={(e) => setFormData((prev) => ({ ...prev, year_gregorian: e.target.value }))}
                        className="bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">E.C. Year</span>
                      <input
                        value={formData.year_ec}
                        onChange={(e) => setFormData((prev) => ({ ...prev, year_ec: e.target.value }))}
                        className="bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Issuing Body (EN)</span>
                    <input
                      value={formData.issuing_body_en}
                      onChange={(e) => setFormData((prev) => ({ ...prev, issuing_body_en: e.target.value }))}
                      className="bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Issuing Body (AM)</span>
                    <input
                      value={formData.issuing_body_am}
                      onChange={(e) => setFormData((prev) => ({ ...prev, issuing_body_am: e.target.value }))}
                      className="bg-slate-50 border border-slate-100 p-2 rounded text-sm text-slate-900 outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => {
                      const name = category.name_en || category.name || String(category.id);
                      const isSelected = formData.categories.includes(name);
                      return (
                        <button
                          key={category.id ?? name}
                          type="button"
                          onClick={() => toggleCategory(name)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            isSelected
                              ? "bg-teal-600 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500">Custom Category</label>
                  <input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Add an extra category if needed"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full rounded-xl bg-teal-600 py-3 font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95"
              >
                Confirm & Publish
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-40">
              <FileText className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm font-medium">Upload a PDF to start the manual publishing flow</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
