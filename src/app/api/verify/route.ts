import { NextRequest, NextResponse } from "next/server";
import { compareNames } from "@/lib/match";
import { extractNameFromIdDocument } from "@/lib/gemini-id";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("idFile");
    const draftName = (formData.get("draftName") as string | null)?.trim();

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Upload an ID image (JPEG, PNG, or WebP)." }, { status: 400 });
    }
    if (!draftName) {
      return NextResponse.json({ error: "draftName is required." }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: "ID verification supports images only (photo of Aadhaar/PAN/etc.)." },
        { status: 400 },
      );
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 8 MB." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "ID verification requires GEMINI_API_KEY on the server." },
        { status: 503 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedName = await extractNameFromIdDocument(
      buffer.toString("base64"),
      mimeType,
    );

    const status = compareNames(draftName, extractedName);
    const severity = status === "match" ? "ok" : status === "typo" ? "warn" : "error";

    let messageEn: string;
    let messageHi: string;
    if (status === "match") {
      messageEn = `ID name "${extractedName}" matches draft "${draftName}".`;
      messageHi = `पहचान पत्र का नाम "${extractedName}" ड्राफ्ट "${draftName}" से मेल खाता है।`;
    } else if (status === "typo") {
      messageEn = `Likely typo: ID has "${extractedName}", draft has "${draftName}".`;
      messageHi = `संभावित टाइपो: पहचान "${extractedName}", ड्राफ्ट "${draftName}".`;
    } else {
      messageEn = `Mismatch: ID has "${extractedName}", draft has "${draftName}".`;
      messageHi = `मेल नहीं: पहचान "${extractedName}", ड्राफ्ट "${draftName}".`;
    }

    return NextResponse.json({
      extractedName,
      draftName,
      status,
      severity,
      messageEn,
      messageHi,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "ID verification failed" },
      { status: 500 },
    );
  }
}