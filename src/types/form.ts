export type FieldConfidence = "high" | "medium" | "low";

export type FormField = {
  id: string;
  label: string;
  hint?: string;
  suggestedAnswer?: string;
  confidence?: FieldConfidence;
  sourceText?: string;
};

export type VerifyCheck = {
  severity: "ok" | "warn" | "error";
  messageEn: string;
  messageHi: string;
  fieldId?: string;
  compareLabel?: string;
  referenceValue?: string;
};

export type FormAnalysis = {
  formTitle: string;
  category: string;
  summaryEn: string;
  summaryHi: string;
  sections: { title: string; meaningEn: string; meaningHi: string }[];
  checklist: { step: number; action: string; actionHi: string }[];
  requiredDocuments: string[];
  pitfalls: string[];
  fields: FormField[];
  portalUrl?: string;
  portalLabel?: string;
  verifyTemplate?: VerifyCheck[];
  generatedAt: string;
};

export type SampleForm = {
  id: string;
  title: string;
  category: string;
  description: string;
};
