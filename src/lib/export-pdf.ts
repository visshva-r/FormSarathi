import { jsPDF } from "jspdf";
import type { FormAnalysis } from "@/types/form";

const FONT_FILE = "NotoSansDevanagari-Regular.ttf";
const FONT_VFS = "NotoSansDevanagari-Regular.ttf";
const FONT_NAME = "NotoSansDevanagari";

let hindiFontBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function ensureHindiFont(doc: jsPDF): Promise<void> {
  if (!hindiFontBase64) {
    const res = await fetch("/fonts/NotoSansDevanagari-Regular.ttf");
    if (!res.ok) throw new Error("Could not load Hindi font for PDF");
    hindiFontBase64 = arrayBufferToBase64(await res.arrayBuffer());
  }
  doc.addFileToVFS(FONT_VFS, hindiFontBase64);
  doc.addFont(FONT_FILE, FONT_NAME, "normal");
}

export async function downloadDraftPdf(
  analysis: FormAnalysis,
  options?: { locale?: "en" | "hi" },
) {
  const locale = options?.locale ?? "en";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;
  let hindiReady = false;

  const ensureY = (need: number) => {
    if (y + need > 780) {
      doc.addPage();
      y = margin;
    }
  };

  const lineLatin = (text: string, size = 11, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 515);
    ensureY(lines.length * (size + 4) + 6);
    doc.text(lines, margin, y);
    y += lines.length * (size + 4) + 6;
  };

  const lineHindi = async (text: string, size = 11) => {
    if (!hindiReady) {
      await ensureHindiFont(doc);
      hindiReady = true;
    }
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 515);
    ensureY(lines.length * (size + 4) + 6);
    doc.text(lines, margin, y);
    y += lines.length * (size + 4) + 6;
    doc.setFont("helvetica", "normal");
  };

  lineLatin("FormSarathi — Draft Answer Sheet", 16, true);
  lineLatin(analysis.formTitle, 13, true);
  lineLatin(`Category: ${analysis.category}`, 10);
  lineLatin("");

  if (locale === "hi" && analysis.summaryHi) {
    lineLatin("सारांश (हिंदी)", 12, true);
    await lineHindi(analysis.summaryHi, 11);
    lineLatin("");
  }

  lineLatin("Suggested answers (review before submitting)", 12, true);
  analysis.fields.forEach((f) => {
    lineLatin(`${f.label}: ${f.suggestedAnswer ?? "—"}`, 10);
  });

  lineLatin("");
  lineLatin("Required documents", 12, true);
  analysis.requiredDocuments.forEach((d) => lineLatin(`• ${d}`, 10));

  lineLatin("");
  lineLatin("Checklist", 12, true);
  for (const c of analysis.checklist) {
    lineLatin(`${c.step}. ${c.action}`, 10);
    if (locale === "hi" && c.actionHi) {
      await lineHindi(`   ${c.actionHi}`, 10);
    }
  }

  if (locale === "hi") {
    lineLatin("");
    lineLatin(
      "Bilingual export: field values follow the form; Hindi steps above use embedded Devanagari.",
      9,
    );
  }

  doc.save(`formsarathi-${analysis.formTitle.replace(/\s+/g, "-").slice(0, 40)}.pdf`);
}