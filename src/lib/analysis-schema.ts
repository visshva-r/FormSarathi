import { z } from "zod";
import type { FormAnalysis } from "@/types/form";

const sectionSchema = z.object({
  title: z.string(),
  meaningEn: z.string(),
  meaningHi: z.string(),
});

const checklistItemSchema = z.object({
  step: z.number(),
  action: z.string(),
  actionHi: z.string(),
});

const fieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  suggestedAnswer: z.string().optional(),
  hint: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
  sourceText: z.string().optional(),
});

export const formAnalysisSchema = z.object({
  formTitle: z.string().min(1),
  category: z.string().min(1),
  summaryEn: z.string().min(1),
  summaryHi: z.string().min(1),
  sections: z.array(sectionSchema).min(1),
  checklist: z.array(checklistItemSchema).min(1),
  requiredDocuments: z.array(z.string()),
  pitfalls: z.array(z.string()),
  fields: z.array(fieldSchema).min(1),
  portalUrl: z.string().url().optional(),
  portalLabel: z.string().optional(),
});

export function parseFormAnalysisJson(raw: string): FormAnalysis {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Model did not return JSON");
  }
  const parsed = formAnalysisSchema.parse(JSON.parse(jsonMatch[0]));
  const fields = parsed.fields.map((f) => ({
    ...f,
    confidence: f.confidence ?? (f.suggestedAnswer?.startsWith("[") ? "low" : "medium"),
  }));
  return {
    ...parsed,
    fields,
    generatedAt: new Date().toISOString(),
  };
}