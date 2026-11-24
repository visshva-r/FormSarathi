import { jsPDF } from "jspdf";
import type { FormAnalysis } from "@/types/form";
import { renderDevanagariBlock } from "@/lib/hindi-canvas";

export async function downloadDraftPdf(
  analysis: FormAnalysis,
  options?: { locale?: "en" | "hi" },
) {
  const locale = options?.locale ?? "en";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const contentWidth = 515;
  let y = margin;

  const ensureY = (need: number) => {
    if (y + need > 780) {
      doc.addPage();
      y = margin;
    }
  };

  const lineLatin = (text: string, size = 11, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureY(lines.length * (size + 4) + 6);
    doc.text(lines, margin, y);
    y += lines.length * (size + 4) + 6;
  };

  const embedHindi = async (text: string) => {
    const { dataUrl, widthPx, heightPx } = await renderDevanagariBlock(text);
    const imgW = contentWidth;
    const imgH = (heightPx / widthPx) * imgW;
    ensureY(imgH + 8);
    doc.addImage(dataUrl, "PNG", margin, y, imgW, imgH);
    y += imgH + 8;
  };

  lineLatin("FormSarathi — Draft Answer Sheet", 16, true);
  lineLatin(analysis.formTitle, 13, true);
  lineLatin(`Category: ${analysis.category}`, 10);
  lineLatin("");

  if (locale === "hi" && analysis.summaryHi) {
    lineLatin("Summary (Hindi)", 12, true);
    await embedHindi(analysis.summaryHi);
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
      await embedHindi(c.actionHi);
    }
  }

  doc.save(`formsarathi-${analysis.formTitle.replace(/\s+/g, "-").slice(0, 40)}.pdf`);
}