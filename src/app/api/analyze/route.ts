import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_ANALYSES } from "@/data/samples";
import { analyzeWithGemini } from "@/lib/gemini";
import type { FormAnalysis } from "@/types/form";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const sampleId = body.sampleId as string | undefined;
      if (sampleId && SAMPLE_ANALYSES[sampleId]) {
        const analysis: FormAnalysis = {
          ...SAMPLE_ANALYSES[sampleId],
          generatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ analysis, source: "sample" as const });
      }
      return NextResponse.json({ error: "Unknown sampleId" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    if (!mimeType.startsWith("image/") && mimeType !== "application/pdf") {
      return NextResponse.json(
        { error: "Upload a JPEG, PNG, WebP image or PDF" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Live upload analysis requires GEMINI_API_KEY. Use a sample form below for instant demo, or set GEMINI_API_KEY in .env.local / Vercel.",
        },
        { status: 503 },
      );
    }

    const analysis = await analyzeWithGemini(base64, mimeType);
    return NextResponse.json({ analysis, source: "upload" as const });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
