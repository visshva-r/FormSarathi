# FormSarathi — Enhanced Prototype Summary (Final Showcase)

**Live demo:** https://formsarathi.vercel.app/  
**Source:** https://github.com/visshva-r/FormSarathi  
**Author:** Visshva R (solo, CodeQuest 2026 Top 50 finalist)

## Problem (why this exists)

Indian civic, education, and welfare forms reject millions of applicants due to **spelling mismatches**, wrong documents, and opaque legal language—not lack of internet access. Families rely on cyber cafés and middlemen.

## Round 2 → Final enhancements

| Capability | What the user gets |
|------------|-------------------|
| Bilingual explain | English + हिंदी on every analysis |
| Web Speech | Read summary and checklist aloud (hi-IN / en-IN) |
| Action checklist | Steps, required documents, pitfalls |
| WhatsApp / copy | Share checklist to family or CSC helper |
| Official portals | Links on all five sample scenarios |
| Grounded draft | Editable fields → **PDF includes your edits** |
| Confidence badges | high / medium / low + source line from form |
| Rejection Guard | Demo ID + live typo→match; rules use **deterministic matcher** |
| Live ID verify | `POST /api/verify` — Gemini reads ID photo, **code compares** name |
| Form vision | Gemini 2.5 Flash upload → Zod validation + one retry |
| Privacy | In-memory processing, Clear results, no server storage |
| Engineering | Vitest on matcher, GitHub Actions CI, `docs/TECHNICAL.md` |

## 60-second judge path

1. National Merit Scholarship → हिंदी → Read aloud  
2. Checklist → scholarships.gov.in → Share on WhatsApp  
3. Draft → fix **Priya Sharmaa** → Download PDF  
4. Verify → green match → (optional) Upload ID photo  
5. Live upload of a form image → Live upload badge + confidence tags  

## Differentiation vs generic AI chat

Chatbots produce conversation. FormSarathi produces **artifacts**: checklist, verified draft PDF, mismatch report, shareable steps—optimized for Indian forms.

## Impact & personal intent

Students, first-gen applicants, and families helping elderly relatives. Building FormSarathi is a step toward fairer access to scholarships and public services; a DotRepo internship would help take this from hackathon MVP toward deployment with NGOs or CSC networks.

## Disclosure

AI tools assisted development and live extraction. Architecture, matcher logic, samples, and problem framing are original.