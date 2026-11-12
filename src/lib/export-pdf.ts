import { jsPDF } from "jspdf";
import type { FormAnalysis } from "@/types/form";

export function downloadDraftPdf(analysis: FormAnalysis) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;

  const line = (text: string, size = 11, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 515);
    if (y + lines.length * (size + 4) > 780) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines, margin, y);
    y += lines.length * (size + 4) + 6;
  };

  line("FormSarathi — Draft Answer Sheet", 16, true);
  line(analysis.formTitle, 13, true);
  line(`Category: ${analysis.category}`, 10);
  line("");

  line("Suggested answers (review before submitting)", 12, true);
  analysis.fields.forEach((f) => {
    line(`${f.label}: ${f.suggestedAnswer ?? "—"}`, 10);
  });

  line("");
  line("Required documents", 12, true);
  analysis.requiredDocuments.forEach((d) => line(`• ${d}`, 10));

  line("");
  line("Checklist", 12, true);
  analysis.checklist.forEach((c) => line(`${c.step}. ${c.action}`, 10));

  doc.save(`formsarathi-${analysis.formTitle.replace(/\s+/g, "-").slice(0, 40)}.pdf`);
}
