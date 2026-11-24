"use client";

import { useMemo, useState } from "react";
import type { FormAnalysis } from "@/types/form";
import { downloadDraftPdf } from "@/lib/export-pdf";
import { speakText } from "@/lib/speech";
import { buildChecklistText, whatsAppShareUrl } from "@/lib/share-checklist";
import { compareNames } from "@/lib/match";
import type { FieldConfidence } from "@/types/form";

type Tab = "explain" | "checklist" | "draft" | "verify";

function ConfidenceBadge({ level }: { level: FieldConfidence }) {
  const styles =
    level === "high"
      ? "bg-emerald-100 text-emerald-900"
      : level === "medium"
        ? "bg-amber-100 text-amber-950"
        : "bg-red-100 text-red-950";
  const label = level === "high" ? "High confidence" : level === "medium" ? "Verify" : "Low confidence";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${styles}`}>
      {label}
    </span>
  );
}

export function AnalysisPanel({
  analysis,
  source,
}: {
  analysis: FormAnalysis;
  source: "sample" | "upload";
}) {
  const [tab, setTab] = useState<Tab>("explain");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [draftValues, setDraftValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(analysis.fields.map((f) => [f.id, f.suggestedAnswer ?? ""])),
  );
  const [copied, setCopied] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "explain", label: "Explain" },
    { id: "checklist", label: "Checklist" },
    { id: "draft", label: "Draft" },
    ...(analysis.verifyTemplate?.length || analysis.fields.some((f) => f.hint)
      ? [{ id: "verify" as const, label: "Verify" }]
      : []),
  ];

  const analysisForPdf: FormAnalysis = useMemo(
    () => ({
      ...analysis,
      fields: analysis.fields.map((f) => ({
        ...f,
        suggestedAnswer: draftValues[f.id] ?? f.suggestedAnswer,
      })),
    }),
    [analysis, draftValues],
  );

  const liveVerify = useMemo(() => {
    const rows: { severity: "ok" | "warn" | "error"; en: string; hi: string }[] = [];
    analysis.verifyTemplate?.forEach((v) => {
      if (v.fieldId && v.referenceValue) {
        const current = draftValues[v.fieldId] ?? "";
        const result = compareNames(current, v.referenceValue);
        if (result === "match") {
          rows.push({
            severity: "ok",
            en: `${v.compareLabel ?? "Reference"}: matches "${v.referenceValue}".`,
            hi: `${v.compareLabel ?? "संदर्भ"}: "${v.referenceValue}" से मेल खाता है।`,
          });
        } else if (result === "typo") {
          rows.push({
            severity: "warn",
            en: `Likely typo: draft "${current}" vs ${v.compareLabel ?? "reference"} "${v.referenceValue}".`,
            hi: `संभावित टाइपो: ड्राफ्ट "${current}" बनाम "${v.referenceValue}".`,
          });
        } else {
          rows.push({
            severity: "error",
            en: `Mismatch: draft "${current}" vs ${v.compareLabel ?? "reference"} "${v.referenceValue}".`,
            hi: `मेल नहीं: ड्राफ्ट "${current}" बनाम "${v.referenceValue}".`,
          });
        }
      } else {
        rows.push({
          severity: v.severity,
          en: v.messageEn,
          hi: v.messageHi,
        });
      }
    });
    return rows;
  }, [analysis.verifyTemplate, draftValues]);

  const onShareWhatsApp = () => {
    const text = buildChecklistText(analysis, lang);
    window.open(whatsAppShareUrl(text), "_blank", "noopener,noreferrer");
  };

  const onCopyChecklist = async () => {
    const text = buildChecklistText(analysis, lang);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onReadSummary = () => {
    const text = lang === "en" ? analysis.summaryEn : analysis.summaryHi;
    speakText(text, lang);
  };

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
          <div className="flex flex-wrap gap-2">
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
            <button
              type="button"
              onClick={onReadSummary}
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-950 hover:bg-amber-200"
            >
              Read aloud
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onShareWhatsApp}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Share checklist on WhatsApp
              </button>
              <button
                type="button"
                onClick={onCopyChecklist}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {copied ? "Copied!" : "Copy checklist"}
              </button>
            </div>
            {analysis.portalUrl && (
              <p className="text-sm text-slate-700">
                Official portal:{" "}
                <a
                  href={analysis.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-800 underline underline-offset-2"
                >
                  {analysis.portalLabel ?? analysis.portalUrl}
                </a>
              </p>
            )}
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
              Suggested answers — review and edit before any official submission. Edits are included
              in the exported PDF.
            </p>
            <div className="space-y-3">
              {analysis.fields.map((f) => (
                <label key={f.id} className="block">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                      {f.label}
                    </span>
                    {f.confidence && (
                      <ConfidenceBadge level={f.confidence} />
                    )}
                    {f.hint && <span className="text-xs text-amber-800">({f.hint})</span>}
                  </div>
                  {f.sourceText && (
                    <p className="mt-0.5 text-xs text-slate-500">From form: “{f.sourceText}”</p>
                  )}
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={draftValues[f.id] ?? ""}
                    onChange={(e) =>
                      setDraftValues((prev) => ({ ...prev, [f.id]: e.target.value }))
                    }
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => downloadDraftPdf(analysisForPdf)}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Download draft PDF (with your edits)
            </button>
          </div>
        )}

        {tab === "verify" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Rejection guard: cross-check draft spelling against supporting IDs before you submit.
              Edit the Draft tab and return here to refresh.
            </p>
            {analysis.verifyTemplate?.length ? (
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demo/id-sample.svg"
                  alt="Demo Aadhaar card showing name Priya Sharma"
                  className="h-auto w-full max-w-[220px] rounded-lg border border-slate-200 bg-white"
                />
                <p className="text-sm text-slate-700">
                  <strong>Demo ID:</strong> name on card is <strong>Priya Sharma</strong>. Compare
                  with your Draft name field — fix typos before applying.
                </p>
              </div>
            ) : null}
            {liveVerify.length === 0 ? (
              <p className="text-sm text-slate-500">No verification rules for this form yet.</p>
            ) : (
              <ul className="space-y-3">
                {liveVerify.map((row, i) => (
                  <li
                    key={i}
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      row.severity === "ok"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                        : row.severity === "warn"
                          ? "border-amber-200 bg-amber-50 text-amber-950"
                          : "border-red-200 bg-red-50 text-red-950"
                    }`}
                  >
                    {lang === "en" ? row.en : row.hi}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}