"use client";

import { useState } from "react";
import type { FormAnalysis } from "@/types/form";
import { downloadDraftPdf } from "@/lib/export-pdf";

type Tab = "explain" | "checklist" | "draft";

export function AnalysisPanel({
  analysis,
  source,
}: {
  analysis: FormAnalysis;
  source: "sample" | "upload";
}) {
  const [tab, setTab] = useState<Tab>("explain");
  const [lang, setLang] = useState<"en" | "hi">("en");

  const tabs: { id: Tab; label: string }[] = [
    { id: "explain", label: "Explain" },
    { id: "checklist", label: "Checklist" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <div className="rounded-2xl border border-teal-900/10 bg-white shadow-lg shadow-teal-950/5">
      <div className="border-b border-teal-900/10 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {analysis.category} · {source === "sample" ? "Sample" : "Live upload"}
            </p>
            <h2 className="text-xl font-bold text-slate-900">{analysis.formTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {lang === "en" ? analysis.summaryEn : analysis.summaryHi}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                lang === "en" ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                lang === "hi" ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {tab === "explain" && (
          <ul className="space-y-4">
            {analysis.sections.map((s) => (
              <li key={s.title} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {lang === "en" ? s.meaningEn : s.meaningHi}
                </p>
              </li>
            ))}
          </ul>
        )}

        {tab === "checklist" && (
          <div className="space-y-6">
            <ol className="space-y-3">
              {analysis.checklist.map((c) => (
                <li
                  key={c.step}
                  className="flex gap-3 rounded-xl bg-teal-50/80 px-4 py-3 text-sm text-slate-800"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-xs font-bold text-white">
                    {c.step}
                  </span>
                  <span>{lang === "en" ? c.action : c.actionHi}</span>
                </li>
              ))}
            </ol>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Required documents</h3>
              <ul className="list-inside list-disc text-sm text-slate-600">
                {analysis.requiredDocuments.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-amber-900">Common pitfalls</h3>
              <ul className="list-inside list-disc text-sm text-amber-900/90">
                {analysis.pitfalls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "draft" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Suggested answers — review and edit before any official submission.
            </p>
            <div className="space-y-3">
              {analysis.fields.map((f) => (
                <label key={f.id} className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                    {f.label}
                  </span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    defaultValue={f.suggestedAnswer}
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => downloadDraftPdf(analysis)}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Download draft PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
