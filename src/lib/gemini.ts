import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FormAnalysis } from "@/types/form";
import { parseFormAnalysisJson } from "@/lib/analysis-schema";

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
  "fields": [{"id": string, "label": string, "suggestedAnswer": string, "confidence": "high"|"medium"|"low", "sourceText": string}]
}
For each field, include confidence (high if clearly read from form, low if guessed) and optional sourceText quoting the form.`;

async function generateRaw(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string,
  base64: string,
  mimeType: string,
) {
  const result = await model.generateContent([
    { text: prompt },
    { inlineData: { mimeType, data: base64 } },
  ]);
  return result.response.text();
}

export async function analyzeWithGemini(
  base64: string,
  mimeType: string,
): Promise<FormAnalysis> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const genAI = new GoogleGenerativeAI(key);
  const modelId = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelId });

  const basePrompt = `You are FormSarathi, a Civic Document Intelligence assistant for India.
Analyze this government/bank/college/scheme form image or PDF page.
${SCHEMA_HINT}
Use simple Hindi (Devanagari) for summaryHi, meaningHi, actionHi.
Be practical and accurate; if unclear, state assumptions in summaryEn.`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const prompt =
        attempt === 0
          ? basePrompt
          : `${basePrompt}\n\nIMPORTANT: Your previous response was invalid JSON. Return ONLY one JSON object, no markdown.`;
      const text = await generateRaw(model, prompt, base64, mimeType);
      return parseFormAnalysisJson(text);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("Analysis parse failed");
    }
  }
  throw lastError ?? new Error("Analysis failed after retry");
}