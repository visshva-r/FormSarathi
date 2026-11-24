import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractNameFromIdDocument(
  base64: string,
  mimeType: string,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const genAI = new GoogleGenerativeAI(key);
  const modelId = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `This image is an Indian identity document (Aadhaar, PAN, voter ID, marksheet, or similar).
Return ONLY JSON: {"fullName": "string"}
fullName = the person's full legal name as printed on the document. No markdown.`;

  const result = await model.generateContent([
    { text: prompt },
    { inlineData: { mimeType, data: base64 } },
  ]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not read name from ID image");
  }
  const parsed = JSON.parse(jsonMatch[0]) as { fullName?: string };
  const name = parsed.fullName?.trim();
  if (!name) {
    throw new Error("No name found on ID");
  }
  return name;
}