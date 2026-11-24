import type { FormAnalysis } from "@/types/form";

export function buildChecklistText(analysis: FormAnalysis, lang: "en" | "hi") {
  const lines: string[] = [
    `FormSarathi — ${analysis.formTitle}`,
    "",
    lang === "en" ? "Steps:" : "कदम:",
  ];
  analysis.checklist.forEach((c) => {
    lines.push(`${c.step}. ${lang === "en" ? c.action : c.actionHi}`);
  });
  lines.push("");
  lines.push(lang === "en" ? "Required documents:" : "जरूरी दस्तावेज:");
  analysis.requiredDocuments.forEach((d) => lines.push(`• ${d}`));
  return lines.join("\n");
}

export function whatsAppShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}