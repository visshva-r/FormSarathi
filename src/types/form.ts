export type FormField = {
  id: string;
  label: string;
  hint?: string;
  suggestedAnswer?: string;
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
  generatedAt: string;
};

export type SampleForm = {
  id: string;
  title: string;
  category: string;
  description: string;
};
