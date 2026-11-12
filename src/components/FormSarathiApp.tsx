"use client";

import { useCallback, useRef, useState } from "react";
import { SAMPLE_FORMS } from "@/data/samples";
import type { FormAnalysis } from "@/types/form";
import { AnalysisPanel } from "./AnalysisPanel";

export function FormSarathiApp() {
  const [analysis, setAnalysis] = useState<FormAnalysis | null>(null);
  const [source, setSource] = useState<"sample" | "upload">("sample");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runSample = useCallback(async (sampleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setAnalysis(data.analysis);
      setSource("sample");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setAnalysis(data.analysis);
      setSource("upload");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
          Civic document intelligence for India
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          FormSarathi
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Upload an Indian form or try a sample. Get plain-language guidance, a checklist, and a
          downloadable draft in English and Hindi.
        </p>
      </header>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a form photo or PDF"
        className={`mb-8 rounded-2xl border-2 border-dashed p-8 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
          drag ? "border-teal-600 bg-teal-50" : "border-slate-300 bg-white"
        }`}
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!loading) fileInputRef.current?.click();
          }
        }}
      >
        <p className="text-sm font-medium text-slate-700">
          Drop a form photo or PDF here, or choose a file
        </p>
        <label className="mt-4 inline-block cursor-pointer rounded-xl bg-teal-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-900">
          Upload form
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            disabled={loading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
            }}
          />
        </label>
        {loading && <p className="mt-3 text-sm text-teal-800">Analyzing…</p>}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Sample forms
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_FORMS.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={loading}
              onClick={() => runSample(s.id)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-teal-600 hover:shadow-md disabled:opacity-50"
            >
              <span className="text-xs font-semibold text-teal-700">{s.category}</span>
              <span className="mt-1 block font-semibold text-slate-900">{s.title}</span>
              <span className="mt-1 block text-xs text-slate-500">{s.description}</span>
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </div>
      )}

      {analysis && <AnalysisPanel analysis={analysis} source={source} />}
    </div>
  );
}
