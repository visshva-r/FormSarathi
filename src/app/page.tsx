import { FormSarathiApp } from "@/components/FormSarathiApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-teal-50/30 to-slate-100">
      <FormSarathiApp />
      <footer className="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
        Outputs are AI-assisted suggestions. Verify every field and document before any official
        submission.{" "}
        <a
          href="https://github.com/visshva-r/FormSarathi"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-teal-800 underline decoration-teal-800/40 underline-offset-2 hover:text-teal-950"
        >
          README on GitHub
        </a>{" "}
        for setup, disclosures, and source code.
      </footer>
    </div>
  );
}
