# FormSarathi

**Civic Document Intelligence for Bharat** — CodeQuest: National Tech Hackathon 2026 (DotRepo).

Turn Indian government, bank, college, and scheme forms into plain-language guidance (English + Hindi), an action checklist, and a downloadable draft PDF.

## Demo (for judges)

1. Open the **live URL** (Vercel) or run locally.
2. Click any card under **Seeded forms** (recommended — works without API keys).
3. Review **Explain** → **Checklist** → **Draft** → **Download draft PDF**.

Optional: upload a form image/PDF if `GEMINI_API_KEY` is configured on the server.

## Run locally

```bash
cd formsarathi
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and add `GEMINI_API_KEY` only if you want live upload analysis.

## Tech stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Vision analysis via Google Gemini (`gemini-2.0-flash`) when API key is set
- Seeded JSON analyses for reliable hackathon demo
- Client-side draft PDF export (`jspdf`)

## Project structure

- `src/app/api/analyze` — sample + upload analysis API
- `src/data/samples.ts` — five judge-ready form scenarios
- `src/components` — upload UI and results panel

## Disclosure

AI tools were used for development and optional live analysis. Problem framing, architecture, and seeded content are original. No API keys are committed to this repository.

## Screenshots

Add screenshots to `/public/screenshots/` before submission, or capture from the running app:
Home → select **National Merit Scholarship** → Checklist tab → Download draft PDF.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import project in Vercel, root directory `formsarathi` if monorepo, or deploy this folder as root.
3. Add environment variable `GEMINI_API_KEY` (optional).
4. Deploy — submit the production URL on Unstop.

## Scripts

```bash
npm run build   # production build
npm run start   # run production server locally
npm run lint
```
