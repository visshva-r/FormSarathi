# FormSarathi — Judge Q&A (final round)

## Why not ChatGPT?

Structured outputs: checklist, portal links, editable draft PDF, Verify tab with deterministic name matching. India-specific sample pack + live vision. Suggests and explains; never auto-submits to government portals.

## Hallucinations?

Zod validates Gemini form JSON with retry. Confidence badges flag weak fields. User must review before submission. ID verify: Gemini extracts text, **Levenshtein matcher** decides match/typo/mismatch.

## Privacy / DPDP?

No database; uploads processed in request memory only. Clear results control. Keys in Vercel env only.

## Scale & cost?

Serverless Vercel; Gemini Flash per page. Stateless; cached samples for demos.

## Accuracy on bad photos?

Low-confidence labels; pitfalls list; future: image pre-processing (slide 5).

## Business / internship vision?

Partnership with CSC operators, college admission cells, state scholarship helpdesks. Free for citizens; internship would focus on pilot with one institution + accessibility testing.

## Solo + AI disclosure?

Solo build; AI used per event rules; README and footer disclose; matcher and architecture are hand-designed.