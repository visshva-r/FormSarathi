import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FormAnalysis } from "@/types/form";

const SCHEMA_HINT = `Return ONLY valid JSON matching this shape:
{
  "formTitle": string,
  "category": string,
  "summaryEn": string,
  "summaryHi": string,
  "sections": [{"title": string, "meaningEn": string, "meaningHi": string}],
  "checklist": [{"step": number, "action": string, "actionHi": string}],
  "requiredDocuments": string[],
  "pitfalls": string[],
  "fields": [{"id": string, "label": string, "suggestedAnswer": string}]
}`;

export async function analyzeWithGemini(
  base64: string,
  mimeType: string,
): Promise<FormAnalysis> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are FormSarathi, a Civic Document Intelligence assistant for India.
Analyze this government/bank/college/scheme form image or PDF page.
${SCHEMA_HINT}
Use simple Hindi (Devanagari) for summaryHi, meaningHi, actionHi.
Be practical and accurate; if unclear, state assumptions in summaryEn.`;

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: base64,
      },
    },
  ]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Model did not return JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Omit<FormAnalysis, "generatedAt">;
  return { ...parsed, generatedAt: new Date().toISOString() };
}
