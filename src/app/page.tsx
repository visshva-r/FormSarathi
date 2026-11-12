import { FormSarathiApp } from "@/components/FormSarathiApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-teal-50/30 to-slate-100">
      <FormSarathiApp />
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Outputs are AI-assisted suggestions. Verify every field and document before any official
        submission. See README on GitHub for project details and disclosures.
      </footer>
    </div>
  );
}
